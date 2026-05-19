#!/bin/bash
set -e

echo "=== K-Flix Teardown ==="

# Step 1 - Delete LB service BEFORE destroying cluster
echo "[1/4] Deleting K8s LoadBalancer..."
kubectl delete svc k-flix -n k-flix --ignore-not-found=true || true
echo "Waiting 60s for AWS to release the Load Balancer..."
sleep 60

# Step 2 - Terraform destroy
echo "[2/4] Running terraform destroy..."
cd terraform && terraform destroy -auto-approve

# Step 3 - Show any orphaned ELB security groups
echo "[3/4] Checking for orphaned ELB security groups..."
aws ec2 describe-security-groups \
  --region us-east-2 \
  --query 'SecurityGroups[?contains(GroupName, `k8s-elb`)].[GroupId,GroupName]' \
  --output table

# Step 4 - Done
echo "[4/4] Teardown complete. No charges should be accumulating."
