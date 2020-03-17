#!/bin/bash

API="http://localhost:4741"
URL_PATH="/hands"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "hand": {
      "cards": "'"${CARD}"'",
      "current_bet": "'"${BET}"'"
    }
  }'

echo
