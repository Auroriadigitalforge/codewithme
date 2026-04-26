"""
Recursion in Python — A simple, fun example.

This demonstrates how recursion works and how it terminates
using a lighthearted proposal scenario.
"""


def propose():
    """Recursively asks the question until a valid answer is given."""
    print("\nBoyfriend 💻: Hey... can I ask you something?")
    answer = input("Girlfriend 💖: Sure, what is it? (say 'ask'): ").lower()

    if answer == "ask":
        reply = input("\nBoyfriend 💻: Will you be mine forever? 💍 (yes/no): ").lower()

        if reply == "yes":
            print("\nGirlfriend 💖: Aww yes! Finally 😚")
            print("Boyfriend 💻: Program completed successfully ❤️")
            return  # Base case — recursion ends here
        elif reply == "no":
            print("\nGirlfriend 💖: Umm... maybe not right now 😅")
            print("Boyfriend 💻: Recursing feelings... Trying again 🌀")
            return propose()  # Recursive call
        else:
            print("\nBoyfriend 💻: That's not valid input 😭 Please answer with yes or no 🧠")
            return propose()  # Recursive call
    else:
        print("\nBoyfriend 💻: You were supposed to say 'ask' 😅 Let's retry!")
        return propose()  # Recursive call


if __name__ == "__main__":
    propose()
