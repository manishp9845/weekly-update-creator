import time
from playwright.sync_api import sync_playwright, expect, Page

def run_verification(page: Page):
    """
    This script verifies the new messaging features:
    1. Logs into the application.
    2. Adds a new message with a 'win' tag.
    3. Verifies the message appears in the new card-based UI.
    4. Takes a screenshot of the message list.
    5. Deletes the newly created message.
    6. Verifies the message is removed.
    """
    try:
        # The logs were inconsistent, but a common port for react-scripts is 3000.
        # If this fails, I will try other ports like 12000.
        page.goto("http://localhost:3000/")

        # --- Log in ---
        # It's safer to sign up a new user each time to ensure a clean state.
        username = f"testuser_{int(time.time())}"
        password = "password123"

        # Click sign up link/button
        page.get_by_role("button", name="Sign up instead").click()

        # Fill out sign up form and submit
        expect(page.get_by_role("heading", name="Sign Up")).to_be_visible()
        page.get_by_label("Username").fill(username)
        page.get_by_label("Password").fill(password)
        page.get_by_role("button", name="Sign Up").click()

        # Should be redirected to login page
        expect(page.get_by_role("heading", name="Login")).to_be_visible(timeout=10000)

        # Log in with the newly created user
        page.get_by_label("Username").fill(username)
        page.get_by_label("Password").fill(password)
        page.get_by_role("button", name="Login").click()

        # --- Verify successful login and navigate to messages ---
        expect(page.get_by_role("heading", name="Weekly Update Generator")).to_be_visible(timeout=10000)

        # --- Add a new message ---
        message_content = "Successfully implemented the new tagged message feature."
        page.get_by_placeholder("Paste your raw messages, notes, or updates here...").fill(message_content)

        # Select the 'win' tag
        page.get_by_role("button", name="Win").click()

        # Save the message
        page.get_by_role("button", name="Save Message").click()

        # --- Verify the message is displayed correctly ---
        # Wait for the new message card to appear in the list
        new_message_card = page.locator(".bg-gray-50", has_text=message_content).first
        expect(new_message_card).to_be_visible(timeout=10000)

        # Check that the tag and content are correct
        expect(new_message_card.get_by_text("Win")).to_be_visible()
        expect(new_message_card.get_by_text(message_content)).to_be_visible()

        # Take a screenshot of the new UI with the new message
        page.screenshot(path="jules-scratch/verification/verification.png")
        print("Successfully captured screenshot of the new message UI.")

        # --- Delete the message ---
        delete_button = new_message_card.get_by_title("Delete message")
        delete_button.click()

        # --- Verify the message is removed ---
        expect(new_message_card).not_to_be_visible(timeout=10000)
        print("Successfully verified message deletion.")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
        # Take a screenshot on error to help with debugging
        page.screenshot(path="jules-scratch/verification/error.png")
        raise

def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            run_verification(page)
        finally:
            browser.close()

if __name__ == "__main__":
    main()