#!/bin/bash
validators=""
files=("src/validators/letters/create.js" "another.yml" "src/validators/postcards/list.js")
for file in "${files[@]}"; do
  if [[ $file == *"src/validators/"* ]]; then
    # echo '::set-output name=VALIDATORS_CHANGED::true'
    validators+=$file
    validators+=", "
  fi
done
# echo "Total characters in a String: ${#str} "
echo "${validators:0:${#validators} - 2}"

