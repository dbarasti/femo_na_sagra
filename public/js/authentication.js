function storePassword() {
    var password = document.getElementById("password").value;
    document.cookie = "password=" + password;
    console.log("Password stored");
}