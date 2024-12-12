#!/bin/bash

for dir in */; do
    if [ -d "$dir/.git" ]; then
        echo "\n=== Git status for $dir ==="
        (cd "$dir" && git status -s)
    else
        echo "\n=== $dir is not a git repository ==="
    fi
done
