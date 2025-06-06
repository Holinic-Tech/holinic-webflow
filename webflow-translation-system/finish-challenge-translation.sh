#!/bin/bash

# Keep running the translation until complete
echo "🚀 Finishing /challenge page translation..."
echo ""

for i in {1..10}
do
  echo "=== Run $i ==="
  node translate-challenge-chunk.js
  
  # Check if translation is complete by looking for "TRANSLATION COMPLETE" in output
  if [ $? -eq 0 ]; then
    echo "✅ Translation might be complete, checking..."
  fi
  
  # Small delay between runs
  sleep 2
done

echo ""
echo "🏁 Script finished. Check https://hairqare.co/de/challenge"