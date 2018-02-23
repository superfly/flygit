#!/bin/bash

if [[ "$TRAVIS_BRANCH" == "master" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
  echo "On master branch, attempting to deploy to Fly..."
  fly deploy
  if [ $? != 0 ]; then
    echo "Deploy Failed!"
    exit 1
  else
    exit 0
  fi
else
  echo "Not on master branch, skipping deploy to Fly."
fi
