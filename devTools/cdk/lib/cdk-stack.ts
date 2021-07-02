import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito'
import * as iam from '@aws-cdk/aws-iam'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as rds from '@aws-cdk/aws-rds'
import { Peer, SecurityGroup } from '@aws-cdk/aws-ec2';

require('dotenv').config()

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
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

    const vpc = new ec2.Vpc(this, 'Vpc', {
      cidr: '10.0.0.0/16',
    });

    const subnetGroup = new rds.SubnetGroup(this, "subnetGroup", {
      description: `Subnetgroup for serverless postgres aurora databasa`,
      vpc: vpc,
      vpcSubnets: {onePerAz: true},
    })

    const auroraSg = new ec2.SecurityGroup(this, "aurora-sg", {
      securityGroupName: "aurora-sg",
      vpc: vpc,
    });
    auroraSg.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(3306),
    )

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
      "yum -y install git",
      "wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash",
      "source ~/.bashrc",
      "nvm install v12.13.1",
      "nvm use v12.13.1",
      "VERSION=1.12.1",
      "curl -sSL https://github.com/cli/cli/releases/download/v${VERSION}/gh_${VERSION}_linux_amd64.tar.gz -o gh_${VERSION}_linux_amd64.tar.gz",
      "tar xvf gh_${VERSION}_linux_amd64.tar.gz",
      "sudo cp gh_${VERSION}_linux_amd64/bin/gh /usr/local/bin/",
      "echo "+`${process.env.GITHUB_TOKEN}`+" > token.txt",
      "gh auth login --with-token > token.txt",
      "gh clone blog",
      "cd blog && yarn install",
      "cd devTools && yarn install",
      "cd cdk && yarn install",
      "cd ../ && echo DATABASE_URL="+`${process.env.DATABASE_URL}`+" > .env",
      "cd ../ && yarn prisma db push"
    )

    // create aurora db serverless cluster 
    const aurora = new rds.ServerlessCluster(this, 'AuroraServerlessCdk', {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      enableDataApi: true,
      vpc: vpc,
      subnetGroup: subnetGroup,
      securityGroups: [SecurityGroup.fromSecurityGroupId(this, "auroraSg", auroraSg.securityGroupId)],
    });

    new cdk.CfnOutput(this, 'identityPoolId', {
      value: identityPool.ref,
      description: 'Cognito Identity Pool ID',
    });

    // output security group
    new cdk.CfnOutput(this, 'VpcDefaultSecurityGroup', {
      value: vpc.vpcDefaultSecurityGroup
    });
  }
}