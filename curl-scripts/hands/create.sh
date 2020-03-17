#!/bin/bash

API="http://localhost:4741"
URL_PATH="/hands"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "hand": {
      "cards": "'"${CARD}"'",
      "current_bet": "'"${BET}"'"
    }
  }'

echo
