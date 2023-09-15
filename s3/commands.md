Assuming credentials have been configured in your `scroobious` AWS profile, the following commands are useful to list and update bucket's cors configuration:
```bash
# List development bucket cors configuration
aws s3api get-bucket-cors \
  --bucket scroobious-app-development \
  --profile scroobious

# Update development bucket cors configuration
aws s3api put-bucket-cors \
  --bucket scroobious-app-development \
  --profile scroobious \
  --cors-configuration file://cors-development.json

# List staging bucket cors configuration
aws s3api get-bucket-cors \
  --bucket scroobious-app-staging \
  --profile scroobious

# Update staging bucket cors configuration
aws s3api put-bucket-cors \
  --bucket scroobious-app-staging \
  --profile scroobious \
  --cors-configuration file://cors-staging.json

# List production bucket cors configuration
aws s3api get-bucket-cors \
  --bucket scroobious-app-production \
  --profile scroobious

# Update staging bucket cors configuration
aws s3api put-bucket-cors \
  --bucket scroobious-app-production \
  --profile scroobious \
  --cors-configuration file://cors-production.json
```
