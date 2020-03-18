#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tables"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "table": {
      "cards": "'"${CARD}"'",
      "total_bet": "'"${BET}"'"
    }
  }'

echo
