const currentYearElement = document.getElementById("currentYear");

if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// Day 3: Transaction Form Validation

const transactionForm = document.getElementById("transactionForm");

if (transactionForm) {
    const transactionType = document.getElementById("transactionType");
    const transactionAmount = document.getElementById("transactionAmount");
    const transactionCategory = document.getElementById("transactionCategory");
    const transactionDescription = document.getElementById("transactionDescription");
    const transactionDate = document.getElementById("transactionDate");
    const formMessage = document.getElementById("formMessage");

    // Set today's date as the default date.
    transactionDate.value = new Date().toLocaleDateString("en-CA");

    function showError(field, errorId, message) {
        const errorElement = document.getElementById(errorId);

        errorElement.textContent = message;
        field.classList.add("invalid");
        field.setAttribute("aria-invalid", "true");
    }

    function clearError(field, errorId) {
        const errorElement = document.getElementById(errorId);

        errorElement.textContent = "";
        field.classList.remove("invalid");
        field.removeAttribute("aria-invalid");
    }

    function clearFormErrors() {
        clearError(transactionType, "typeError");
        clearError(transactionAmount, "amountError");
        clearError(transactionCategory, "categoryError");
        clearError(transactionDescription, "descriptionError");
        clearError(transactionDate, "dateError");

        formMessage.textContent = "";
        formMessage.className = "form-message";
    }

    function validateTransactionForm() {
        clearFormErrors();

        let isValid = true;

        // Validate transaction type.
        if (!["income", "expense"].includes(transactionType.value)) {
            showError(
                transactionType,
                "typeError",
                "Please select a transaction type."
            );
            isValid = false;
        }

        // Validate amount.
        const amount = Number(transactionAmount.value);

        if (
            transactionAmount.value.trim() === "" ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            showError(
                transactionAmount,
                "amountError",
                "Enter an amount greater than ₹0."
            );
            isValid = false;
        }

        // Validate category.
        if (!transactionCategory.value) {
            showError(
                transactionCategory,
                "categoryError",
                "Please select a category."
            );
            isValid = false;
        }

        // Validate description.
        if (!transactionDescription.value.trim()) {
            showError(
                transactionDescription,
                "descriptionError",
                "Please enter a description."
            );
            isValid = false;
        }

        // Validate date.
        if (!transactionDate.value) {
            showError(
                transactionDate,
                "dateError",
                "Please select a date."
            );
            isValid = false;
        } else {
            const selectedDate = new Date(
                `${transactionDate.value}T00:00:00`
            );

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (
                Number.isNaN(selectedDate.getTime()) ||
                selectedDate > today
            ) {
                showError(
                    transactionDate,
                    "dateError",
                    "Date cannot be in the future."
                );
                isValid = false;
            }
        }

        return isValid;
    }

    transactionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateTransactionForm()) {
            formMessage.textContent = "Please correct the errors above.";
            formMessage.classList.add("error");
            return;
        }

        // Day 3: Validate and preview the transaction.
        // Saving transactions and updating the dashboard come later.

        formMessage.textContent =
            "Validation successful! Transaction details are ready.";

        formMessage.classList.add("success");

        console.log("Validated transaction:", {
            type: transactionType.value,
            amount: Number(transactionAmount.value),
            category: transactionCategory.value,
            description: transactionDescription.value.trim(),
            date: transactionDate.value
        });
    });

    // Clear individual field errors when the user edits the field.
    transactionType.addEventListener("change", () =>
        clearError(transactionType, "typeError")
    );

    transactionAmount.addEventListener("input", () =>
        clearError(transactionAmount, "amountError")
    );

    transactionCategory.addEventListener("change", () =>
        clearError(transactionCategory, "categoryError")
    );

    transactionDescription.addEventListener("input", () =>
        clearError(transactionDescription, "descriptionError")
    );

    transactionDate.addEventListener("change", () =>
        clearError(transactionDate, "dateError")
    );
}