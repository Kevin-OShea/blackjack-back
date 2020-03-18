#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tables"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "table": {
      "cards": "'"${CARD}"'",
      "total_bet": "'"${BET}"'",
      "owner_name": "'"${NAME}"'"
    }
  }'

echo
