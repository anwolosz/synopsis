#!/bin/bash
set -ex
SCRIPT_FOLDER=$(dirname "${0}") 
WORKSPACE_FOLDER=$(readlink -e "${SCRIPT_FOLDER}/../../")
JSON_FOLDER="$WORKSPACE_FOLDER/src/assets/" 
python3 "$SCRIPT_FOLDER"/json_test.py "$JSON_FOLDER"
