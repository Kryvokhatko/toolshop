Test case: "Make an order of Hand Tool as a Customer and complete flow as an Admin".
Precondition: both Customer and Admin should be logged in before test execution by using tests\auth.setup.js setup "Login and save auth states".

1. Login as Customer (customer@ukr.net). Expected result: Customer goes to https://practicesoftwaretesting.com/account.
2. Click dropdown button "Categories" and select "Hand tools" item. Expected result: Customer goes to https://practicesoftwaretesting.com/category/hand-tools and can see header "Category: Hand Tools".
3. Scroll down and click button "page 3" (page.getByRole('button', { name: 'Page-3' })). Expected result Customer should stay at https://practicesoftwaretesting.com/category/hand-tools and can see product with name "Tape Measure 5m" (data-test="product-01KKP021Z8AG3FNQJJMSQYJYPS").
4. Click product with name "Tape Measure 5m". Expected result Customer go to https://practicesoftwaretesting.com/product/01KKP021Z8AG3FNQJJMSQYJYPS and see header "Tape Measure 5m".
5. Click button add to Cart (data-test="add-to-cart").
6. Verify that alert with text "Product added to shopping cart." appeared.
7. Click Cart button (data-test="nav-cart"). Expected result: Customer go to https://practicesoftwaretesting.com/checkout and  element (.steps-4.steps-indicator) is visible.
8. Verify item name in column Item is "Tape Measure 5m" .
9. Click button "Proceed to checkout". Expected result: Customer stays at the same page https://practicesoftwaretesting.com/checkout but message "Hello Customer UniqueUser, you are already logged in. You can proceed to checkout." appeared.
10. Click button "Proceed to checkout" again. Expected result: Customer stays at the same page https://practicesoftwaretesting.com/checkout but header "Billing Address" appeared.
11. Click button "Proceed to checkout" again. Expected result: Customer stays at the same page https://practicesoftwaretesting.com/checkout but header "Payment" appeared.
12. Click dropdown button (id="payment-method") to select payment method and select "Credit Card" option. Expected result: Customer stays at the same page https://practicesoftwaretesting.com/checkout text fields for credit card appeared.
13. Complete text fields with data:
[data-test="credit_card_number"] => "1111-2222-3333-4444"
[data-test="expiration_date"] => "12/2029"
[data-test="cvv"] => "123"
[data-test="card_holder_name"] => "Customer UniqueUser"

14. Click "Confirm" button. Expected result: Customer stays at the same page https://practicesoftwaretesting.com/checkout and message "Payment was successful" appeared.
15. Click "Confirm" button again. Expected result: Customer stays at the same page https://practicesoftwaretesting.com/checkout and message "Thanks for your order! Your invoice number is INV-2026000002." appeared. Note that "INV-2026000002" is not constant and can be any other text.

16. Go to https://practicesoftwaretesting.com/auth/login 
17. Login as Admin. Expected result: Admin goes to https://practicesoftwaretesting.com/admin/dashboard and under the header "Latest orders" Admin can see the list of rows with orders from clients.  The first row in the list of orders is an order from Customer with invoice INV-2026000002 in the first column Invoice Number.
18. Click button "Edit" in that row. Expected result: Admin goes to https://practicesoftwaretesting.com/admin/orders/edit/01kkp259rgx37g9vatv3xf8bkn where detaild information about this order can be seen.
19. Click status selector [data-test="order-status"] and select "COMPLETED" option.
20. Click button "Update status" [data-test="update-status-submit"]. Expected result: under that button message "Status updated!" appeared.
21. Go to https://practicesoftwaretesting.com/admin/orders Expected result: Admin can see a list of rows with orders and the first one has "INV-2026000002" in the first column, and "COMPLETED" in the Status column.
22. Verify that Admin can see a list of rows with orders and the first one has "INV-2026000002" in the first column, and "COMPLETED" in the Status column.
