#!/bin/bash


curl -X POST -H "Content-Type: application/json" -d "{\"tag\": \"${TAG_NAME}\",\"repo\": \"${REPO_NAME}\"}" https://ci.smartkf.top/release