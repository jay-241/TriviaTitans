// 

// export default {
//     "REGION": "us-east-1",
//     "USER_POOL_ID": "us-east-1_MsHyhUYSr",
//     "USER_POOL_APP_CLIENT_ID": "5cm5p1n8m11vvclk312lifshs1"
// }

import { CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, CognitoUser, CognitoUserPool, CognitoUserSession, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';

const poolData = {
    UserPoolId: 'us-east-1_MsHyhUYSr',
    ClientId: "5cm5p1n8m11vvclk312lifshs1"
};
   
const userPool = new CognitoUserPool(poolData);

export async function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser()
    console.log(cognitoUser)

    if (!cognitoUser) {
      reject(new Error("No user found"))
      return
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err)
        return
      }
      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          reject(err)
          return
        }
        const userData = attributes.reduce((acc, attribute) => {
          acc[attribute.Name] = attribute.Value
          return acc
        }, {})

        resolve({ ...userData, username: cognitoUser.username })
      })
    })
  })
}

export async function updateUserAttributes(attributes) {
  try {
    const currentUser = userPool.getCurrentUser();

    if (!currentUser) {
      throw new Error('No user found');
    }
    console.log(attributes[0]['Name']);
    const attributeList = [];

    Object.keys(attributes).forEach((key) => {
      const attribute = {
        Name: attributes[key]['Name'],
        Value: attributes[key]['Value'],
      };
      // console.log(attribute)

      attributeList.push(new CognitoUserAttribute(attribute));
      
      console.log(attributeList)
    });

    await new Promise((resolve, reject) => {
      currentUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }

        currentUser.updateAttributes(attributeList, (updateErr, result) => {
          if (updateErr) {
            reject(updateErr);
            return;
          }
          resolve(result);
        });
      });
    });

    console.log('User data updated successfully');
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}
