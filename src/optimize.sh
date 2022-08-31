#!/usr/bin/env bash

# Optimize original jpg images with mozjpeg

FILES=(`find . -type f -path '*/*/original.jpg' -depth 3`)

for FILE in "${FILES[@]}"; do
  npx mozjpeg -outfile "$FILE.new" $FILE

  OLD_SIZE=`wc -c < $FILE | tr -d ' '`
  NEW_SIZE=`wc -c < "$FILE.new" | tr -d ' '`
  DELTA=`echo "$NEW_SIZE / $OLD_SIZE" | bc -l`
  ENOUGH=`echo $DELTA'<'0.95 | bc -l`

  if [ "$ENOUGH" -eq "1" ]; then
    rm $FILE
    mv "$FILE.new" $FILE
  else
    rm "$FILE.new"
  fi
done
