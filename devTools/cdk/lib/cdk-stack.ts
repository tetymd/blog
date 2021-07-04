import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito'
import * as iam from '@aws-cdk/aws-iam'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as rds from '@aws-cdk/aws-rds'
import * as lmd from '@aws-cdk/aws-lambda'
import * as lmdnode from '@aws-cdk/aws-lambda-nodejs'

require('dotenv').config()

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    ////////////////////////////////
    /// Cognito
    ////////////////////////////////
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'blog',
    })

    const readOnlyScope = new cognito.ResourceServerScope({
      scopeName: 'read',
      scopeDescription: 'read only access'
    })

    const fullAccessScope = new cognito.ResourceServerScope({
      scopeName: '*',
      scopeDescription: 'Full Access'
    })

    userPool.addResourceServer('ResourceServer', {
      identifier: 'users',
      scopes: [readOnlyScope, fullAccessScope]
    })

    const userPoolClient = new cognito.UserPoolClient(this, "CognitoAppClient", {
      userPool,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
      userPoolClientName: 'web',
    })

    const identityPool = new cognito.CfnIdentityPool(this, "Identity-pool", {
      identityPoolName: "blog",
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{
        clientId: userPoolClient.userPoolClientId,
        providerName: userPool.userPoolProviderName
      }]
    })

    const isAnonymousCognitoGroupRole = new iam.Role(
      this,
      'anonymous-group-role',
      {
        description: 'Default role for anonymous users',
        assumedBy: new iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'unauthenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity',
        ),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AWSLambdaBasicExecutionRole'
          ),
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            'AWSAppSyncInvokeFullAccess'
          ),
        ],
      },
    );
  
    const isUserCognitoGroupRole = new iam.Role(this, 'users-group-role', {
      description: 'Default role for authenticated users',
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AWSAppSyncInvokeFullAccess'
        ),
      ],
    });

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      'identity-pool-role-attachment',
      {
        identityPoolId: identityPool.ref,
        roles: {
          authenticated: isUserCognitoGroupRole.roleArn,
          unauthenticated: isAnonymousCognitoGroupRole.roleArn,
        },
        roleMappings: {
          mapping: {
            type: 'Token',
            ambiguousRoleResolution: 'AuthenticatedRole',
            identityProvider: `cognito-idp.${
              cdk.Stack.of(this).region
            }.amazonaws.com/${userPool.userPoolId}:${
              userPoolClient.userPoolClientId
            }`,
          },
        },
      },
    );

    ////////////////////////////////
    /// VPC
    ////////////////////////////////

    const vpc = new ec2.Vpc(this, 'Vpc', {
      cidr: '10.0.0.0/16',
    });

    // debug用
    // const vpcFlowLog = new ec2.FlowLog(this, 'VpcFlowLog', {
    //   resourceType: ec2.FlowLogResourceType.fromVpc(vpc)
    // })
    // vpc.privateSubnets.forEach((subnet, i) => {
    //   const subnetFlowLog = new ec2.FlowLog(this, 'Private'+(i+1).toString()+'FlowLog', {
    //     resourceType: ec2.FlowLogResourceType.fromSubnet(subnet)
    //   })
    // })

    const subnetGroup = new rds.SubnetGroup(this, "subnetGroup", {
      description: `Subnetgroup for serverless postgres aurora databasa`,
      vpc: vpc,
      vpcSubnets: {onePerAz: true},
    })

    ////////////////////////////////
    /// Aurora Serverless MySQL
    ////////////////////////////////

    const dbUser = `${process.env.DB_USERNAME}`

    const auroraSg = new ec2.SecurityGroup(this, "aurora-sg", {
      securityGroupName: "aurora-sg",
      vpc: vpc,
    });
    auroraSg.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(3306),
    )

    const dbSecret = new rds.DatabaseSecret(this, "aurora-secret", {
      username: dbUser
    })

    // create aurora db serverless cluster 
    const aurora = new rds.ServerlessCluster(this, 'AuroraServerlessCdk', {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      credentials: rds.Credentials.fromSecret(dbSecret),
      enableDataApi: true,
      scaling: {
        autoPause: cdk.Duration.minutes(5),
        maxCapacity: rds.AuroraCapacityUnit.ACU_2,
        minCapacity: rds.AuroraCapacityUnit.ACU_1
      },
      vpc: vpc,
      subnetGroup: subnetGroup,
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(this, "auroraSg", auroraSg.securityGroupId)],
    });

    ////////////////////////////////
    /// Bastion EC2
    ////////////////////////////////

    const cliUser = new iam.User(this, 'cliUser')
    cliUser.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "secretsmanager:GetResourcePolicy",
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret",
        "secretsmanager:ListSecretVersionIds"
      ],
      resources: [
        `${dbSecret.secretFullArn}`
      ]
    }))

    const key = new iam.CfnAccessKey(this, 'cliUserCredential', {
      userName: cliUser.userName
    })

    const bastionSg = new ec2.SecurityGroup(this, "from-bastion", {
      securityGroupName: "from-bastion",
      vpc: vpc,
    });
    bastionSg.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcpRange(0, 65535),
    )

    const allowFromBastionSg = new ec2.SecurityGroup(this, "allow-from-bastion", {
      securityGroupName: "allow-from-bastion",
      vpc: vpc
    });
    allowFromBastionSg.addIngressRule(
      bastionSg,
      ec2.Port.tcp(22)
    );

    const bastion = new ec2.BastionHostLinux(this, "bastion", {
      vpc: vpc,
      instanceName: "bastion",
      instanceType: new ec2.InstanceType("t3.micro"),
      securityGroup: bastionSg
    });
    bastion.instance.addUserData(
      "yum -y update",
      "yum -y install git mysql jq",
      "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash",
      ". .nvm/nvm.sh",
      "nvm install v12.13.1",
      "nvm use v12.13.1",
      "npm install -g yarn",
      "git clone https://github.com/tetymd/blog",
      "cd blog/devTools/cdk && yarn install",
      "echo USER_NAME="+`${process.env.USER_NAME}`+" >> .env",
      "echo USER_ID="+`${process.env.USER_ID}`+" >> .env",
      "echo USER_EMAIL="+`${process.env.USER_EMAIL}`+" >> .env",
      "echo USER_ROLE="+`${process.env.USER_ROLE}`+" >> .env",
      "aws configure set aws_access_key_id "+`${key.ref}`,
      "aws configure set aws_secret_access_key "+`${key.attrSecretAccessKey}`,
      "aws configure set region "+`${process.env.REGION}`,
      "SECRET=$(aws secretsmanager get-secret-value --secret-id "+`${dbSecret.secretName}`+" | grep SecretString | awk \'{print $2}\' | sed \'s/}\",/}\"/g\' | jq -r \'fromjson | .password\')",
      "echo DATABASE_URL=mysql://"+dbUser+":${SECRET}@"+aurora.clusterEndpoint.hostname+":3306/blog >> .env",
      "yarn prisma db push",
      "sleep 30 && yarn prisma db push",
      "yarn prisma db seed --preview-feature"
    )
    bastion.node.addDependency(aurora)

    ////////////////////////////////
    /// Lambda
    ////////////////////////////////

    const apiLambda = new lmdnode.NodejsFunction(this, 'apilambda', {
      runtime: lmd.Runtime.NODEJS_12_X,
      memorySize: 1024,
      entry: 'lambda/api.ts',
      environment: {
        SECRET_ID: dbSecret.secretFullArn || '',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
      },
      vpc: vpc,
      vpcSubnets: vpc.selectSubnets(),
      securityGroups: [
        bastionSg
      ],
      bundling: {
        // commandHooksでインストール前、バンドル前、後にコマンドを組み込める
        commandHooks: {
          beforeInstall(inputDir: string, outputDir: string): string[] {
            return [``];
          },
          beforeBundling(inputDir: string, outputDir: string): string[] {
            return [``];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [
              // クエリエンジンを追加
              `cp ${inputDir}/node_modules/.prisma/client/query-engine-rhel-openssl-1.0.x ${outputDir}`,
              // スキーマ定義を追加
              `cp ${inputDir}/node_modules/.prisma/client/schema.prisma ${outputDir}`,
            ];
          },
        },
      }
    })

    apiLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['secretsmanager:GetSecretValue'],
        resources: [dbSecret.secretFullArn || ''],
      })
    )

    ////////////////////////////////
    /// Outputs
    ////////////////////////////////

    new cdk.CfnOutput(this, 'identityPoolId', {
      value: identityPool.ref,
      description: 'Cognito Identity Pool ID',
    });

    // output security group
    new cdk.CfnOutput(this, 'VpcDefaultSecurityGroup', {
      value: vpc.vpcDefaultSecurityGroup
    });

    new cdk.CfnOutput(this, 'auroraHostName', {
      value: aurora.clusterEndpoint.hostname
    });

    new cdk.CfnOutput(this, 'auroraDbSecretId', {
      value: dbSecret.secretName
    });

    new cdk.CfnOutput(this, 'cliUserAccessKey', {
      value: key.ref
    });

    new cdk.CfnOutput(this, 'cliUserSecretAccessKey', {
      value: key.attrSecretAccessKey
    });

    new cdk.CfnOutput(this, 'bastionInstanceId', {
      value: bastion.instanceId
    });
  }
}