#!/bin/bash

USERNAME="$1"
GROUP="ecommerce-api"

if [ -z "$USERNAME"]; then
   echo "Usage: $0 <username>"
   exit 1;
fi

if ! getent group "$GROUP" > /dev/null; then
  echo "Group '$GROUP' does not exit."
  exit 1
fi

if id "$USERNAME" &>/dev/null; then
    echo "User '$USERNAME' already exists."
    exit 1
fi

useradd -m -s /bin/bash "$USERNAME"

if [$? -ne 0]; then
  echo "Failed to create user '$USERNAME'."
  exist 1
fi

passwd "$USERNAME"

usermod -aG "$GROUP" "$USERNAME"

echo "User '$USERNAME' created and added to '$GROUP'."


