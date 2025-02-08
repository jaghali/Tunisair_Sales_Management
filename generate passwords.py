import random
import string

# Function to generate a random password
def generate_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for i in range(length))

# Number of passwords to generate
num_passwords = 18941

# List to store generated passwords
passwords = []

# Generate the passwords
for _ in range(num_passwords):
    passwords.append(generate_password())

# Write passwords to a file
with open('passwords.txt', 'w') as file:
    for password in passwords:
        file.write(password + '\n')

print(f"{num_passwords} passwords have been generated and saved to 'passwords.txt'.")
