# AWS Configuration Cheat Sheet

updated 8-19-2021

This lecture note is not intended to be a replacement for the videos, but to serve as a cheat sheet for students who want to quickly run thru the AWS configuration steps or easily see if they missed a step.It will also help navigate through the changes to the AWS UI since the course was recorded.

## EBS Application Creation (**If using Amazon Linux 2 Platform Platform**)

1. Go to AWS Management Console and use Find Services to search for Elastic Beanstalk
2. Click “Create Application”
3. Set Application Name to '***multi-ctnr-app***'
4. Scroll down to Platform and select Docker
5. The Platform Branch should be automatically set to Docker Running on 64bit Amazon Linux 2.
6. Click Create Application
7. You may need to refresh, but eventually, you should see a green checkmark underneath Health.


## RDS Database Creation

1. Go to AWS Management Console and use Find Services to search for RDS
2. Click Create database button
3. Select PostgreSQL
4. Change Version to the newest available v12 version (The free tier is currently not available for Postgres v13)
5. In Templates, check the Free tier box.
6. Scroll down to Settings.
7. Set DB Instance identifier to ***multi-ctnr-app-postgres***
8. Set **Master Username** to ***pguser***
9. Set **Master Password** to ***pgpassword*** and confirm.
10. Scroll down to **Connectivity**.
11. Make sure VPC is set to **Default VPC.**
12. Scroll down to **Additional Configuration** and click to **unhide**.
13. Set Initial database name to ***fib_indices***.
14. Scroll down and click Create Database button


## ElastiCache Redis Creation

1. Go to AWS Management Console and use Find Services to search for ElastiCache
2. Click **Redis** in sidebar
3. Click the Create button
4. Make sure **Cluster Mode Enabled** is **NOT** ticked
5. In Redis Settings form, set Name to ***multi-ctnr-app-redis***
6. Change Node type to 'cache.t2.micro'
7. Change **Replicas per Shard** to ***0***
8. Scroll down and click Create button


## Creating a Custom Security Group

1. Go to AWS Management Console and use Find Services to search for VPC
2. Find the Security section in the left sidebar and click Security Groups
3. Click Create Security Group button
4. Set Security group name to multi-ctnr-app-sg
5. Set Description to 'multi-container application security group''
6. Make sure VPC is set to default VPC
7. Scroll down and click the Create Security Group button.
8. After the security group has been created, find the Edit inbound rules button.
9. Click Add Rule
10. Set Port Range to 5432-6379 	# 5432 for postgres, 6379 for redis
11. Click in the box next to Source and start typing 'sg' into the box. Select the Security Group you just created.
12. Click the Save rules button


## Applying Security Groups to ElastiCache

1. Go to AWS Management Console and use Find Services to search for ElastiCache
2. Click Redis in Sidebar
3. Check the box next to Redis cluster
4. Click Actions and click Modify
5. Click the pencil icon to edit the VPC Security group.
6. Tick the box next to the new multi-ctnr-app-redis group and click Save
7. Click Modify


## Applying Security Groups to RDS

1. Go to AWS Management Console and use Find Services to search for RDS
2. Click Databases in Sidebar and check the box next to your instance
3. Click Modify button
4. Scroll down to Connectivity and add the new multi-ctnr-app-sg security group
5. Scroll down and click the Continue button
6. Click Modify DB instance button


## Applying Security Groups to Elastic Beanstalk

1. Go to AWS Management Console and use Find Services to search for Elastic Beanstalk
2. Click Environments in the left sidebar.
3. Click Multi-ctnr-app-linux2-env
4. Click Configuration
5. In the Instances row, click the Edit button.
6. Scroll down to EC2 Security Groups and tick box next to ***multi-ctnr-app-sg***
7. Click Apply and Click Confirm
8. After all the instances restart and go from No Data to Severe, you should see a green checkmark under Health.



## Add AWS configuration details to .travis.yml file's deploy script

1. Set the region. The region code can be found by clicking the region in the toolbar next to your username.
   eg: 'us-west-2'
2. app should be set to the EBS Application Name
   eg: 'multi-ctnr-app'
3. env should be set to your EBS Environment name.
   eg: 'Multi-ctnr-app-linux2-env'

4. Set the bucket_name. This can be found by searching for the S3 Storage service. Click the link for the elasticbeanstalk bucket that matches your region code and copy the name.

    eg: 'elasticbeanstalk-us-east-1-923445599289'

5. Set the bucket_path to 'multi-ctnr-app'
6. Set access_key_id to $AWS_ACCESS_KEY
7. Set secret_access_key to $AWS_SECRET_KEY

## Setting Environment Variables

1. Go to AWS Management Console and use Find Services to search for Elastic Beanstalk
2. Click Environments in the left sidebar.
3. Click Multi-ctnr-app-linux2-env
4. Click Configuration
5. In the Software row, click the Edit button
6. Scroll down to Environment properties
7. In another tab Open up ElastiCache, click Redis and check the box next to your cluster. Find the Primary Endpoint and copy that value but omit the :6379
8. Set REDIS_HOST key to the primary endpoint listed above, remember to omit :6379
9. Set REDIS_PORT to 6379
10. Set PGUSER to ***pguser***
11. Set PGPASSWORD to ***pgpassword***
12. In another tab, open up the RDS dashboard, click databases in the sidebar, click your instance and scroll to Connectivity and Security. Copy the endpoint.
13. Set the PGHOST key to the endpoint value listed above.
14. Set PGDATABASE to ***fib_indices***
15. Set PGPORT to 5432
16. Click Apply button
17. After all instances restart and go from No Data, to Severe, you should see a green checkmark under Health.



## IAM Keys for Deployment

You can create a new IAM user for this application:

1. Search for the "IAM Security, Identity & Compliance Service"
2. Click "Create Individual IAM Users" and click "Manage Users"
3. Click "Add User"
4. Enter any name you’d like in the "User Name" field.
   eg: multi-ctnr-app-ci
5. Tick the "Programmatic Access" checkbox
6. Click "Next:Permissions"
7. Click "Attach Existing Policies Directly"
8. Search for "beanstalk"
9. Tick the box next to "AdministratorAccess-AWSElasticBeanstalk"
10. Click "Next:Tags"
11. Click "Next:Review"
12. Click "Create user"
13. Copy and / or download the Access Key ID and Secret Access Key to use in the Travis Variable Setup.



## AWS Keys in Travis

1. Go to your Travis Dashboard and find the project repository for the application we are working on.
2. On the repository page, click "More Options" and then "Settings"
3. Create an AWS_ACCESS_KEY variable and paste your IAM access key
4. Create an AWS_SECRET_KEY variable and paste your IAM secret key
5. Deploying App
6. Make a small change to your src/App.js file in the greeting text.
7. In the project root, in your terminal run:

```
	git add.
	git commit -m “testing deployment"
	git push origin master
```



8. Go to your Travis Dashboard and check the status of your build.
9. The status should eventually return with a green checkmark and show "build passing"
10. Go to your AWS Elasticbeanstalk application
11. It should say "Elastic Beanstalk is updating your environment"
12. It should eventually show a green checkmark under "Health". You will now be able to access your application at the external URL provided under the environment name.
