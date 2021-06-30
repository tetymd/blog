import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito'
import * as iam from '@aws-cdk/aws-iam'
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
            'service-role/AWSLambdaBasicExecutionRole',
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

    new cdk.CfnOutput(this, 'identityPoolId', {
      value: identityPool.ref,
      description: 'Cognito Identity Pool ID',
    });
  }
}
