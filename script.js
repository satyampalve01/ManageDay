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
            formMessage.className = "form-message error";
            return;
        }

        const transaction = {
            id: Date.now(),
            type: transactionType.value,
            amount: Number(transactionAmount.value),
            category: transactionCategory.value,
            description: transactionDescription.value.trim(),
            date: transactionDate.value
        };

        renderTransaction(transaction);

        formMessage.textContent = "Transaction added successfully!";
        formMessage.className = "form-message success";

        transactionForm.reset();

        transactionDate.value = new Date().toLocaleDateString("en-CA");
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

// Day 4: Display transactions dynamically

const transactionList = document.getElementById("transactionList");

function renderTransaction(transaction) {
    // Create transaction row
    const item = document.createElement("article");
    item.className = "transaction-row";

    // Transaction information
    const info = document.createElement("div");
    info.className = "transaction-info";

    const icon = document.createElement("div");
    icon.className = "transaction-icon";

    icon.textContent =
        transaction.type === "income" ? "I" : "E";

    const details = document.createElement("div");

    const title = document.createElement("h4");
    title.textContent = transaction.description;

    const metadata = document.createElement("p");
    metadata.textContent =
        `${transaction.category} · ${transaction.date}`;

    details.append(title, metadata);
    info.append(icon, details);

    // Transaction amount
    const amount = document.createElement("strong");

    amount.className =
        transaction.type === "income"
            ? "amount-income"
            : "amount-expense";

    amount.textContent =
        `${transaction.type === "income" ? "+" : "−"}₹${transaction.amount}`;

    // Add everything to the transaction row
    item.append(info, amount);

    // Remove empty message
    const emptyMessage = document.getElementById("emptyTransactions");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    // Display the latest transaction first
    transactionList.prepend(item);
}