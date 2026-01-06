import secrets
import string


def generate_password(length=16,
                      include_uppercase=True,
                      include_lowercase=True,
                      include_digits=True,
                      include_symbols=True):
    """
    Generate a secure random password with the specified options.
    """
    if length < 8:
        raise ValueError("Password length should be at least 8 for security")

    # Build character pool
    alphabet = ''
    if include_lowercase:
        alphabet += string.ascii_lowercase
    if include_uppercase:
        alphabet += string.ascii_uppercase
    if include_digits:
        alphabet += string.digits
    if include_symbols:
        alphabet += string.punctuation

    if not alphabet:
        raise ValueError("At least one character type must be selected")

    # Ensure at least one character from each selected category
    password = []
    if include_lowercase:
        password.append(secrets.choice(string.ascii_lowercase))
    if include_uppercase:
        password.append(secrets.choice(string.ascii_uppercase))
    if include_digits:
        password.append(secrets.choice(string.digits))
    if include_symbols:
        password.append(secrets.choice(string.punctuation))

    # Fill remaining length
    remaining = length - len(password)
    for _ in range(remaining):
        password.append(secrets.choice(alphabet))

    # Shuffle for better randomness
    secrets.SystemRandom().shuffle(password)

    return ''.join(password)


def get_user_preferences():
    """Interactively ask the user for password preferences."""
    print("=== Secure Password Generator ===\n")

    while True:
        try:
            length = int(input("Enter desired password length (minimum 8): "))
            if length < 8:
                print("Please enter a length of at least 8.")
                continue
            break
        except ValueError:
            print("Please enter a valid number.")

    print("\nInclude the following character types? (y/n)")

    uppercase = input("Uppercase letters (A-Z)? ").strip().lower() == 'y'
    lowercase = input("Lowercase letters (a-z)? ").strip().lower() == 'y'
    digits = input("Digits (0-9)? ").strip().lower() == 'y'
    symbols = input("Symbols (!@#$%^&* etc.)? ").strip().lower() == 'y'

    # Default to including lowercase if nothing is selected
    if not (uppercase or lowercase or digits or symbols):
        print("No character types selected — defaulting to including all types.")
        uppercase = lowercase = digits = symbols = True

    return {
        'length': length,
        'include_uppercase': uppercase,
        'include_lowercase': lowercase,
        'include_digits': digits,
        'include_symbols': symbols
    }


if __name__ == "__main__":
    prefs = get_user_preferences()

    password = generate_password(**prefs)

    print("\n" + "=" * 40)
    print("Your generated password:")
    print(password)
    print("=" * 40)