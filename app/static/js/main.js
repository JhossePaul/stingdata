var csrftoken = $("meta[name=csrf-token]").attr("content");

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
}):

$(document).ready(functin () {
    // Initial check to see if user is logged in or not
    updateAuthStatus();

    // Setup logged in view
    $("#logged-in-view button").click(function () {
        logout()
            .done(function(response) {
                showLoggedout();
            })
            .fail(function (response) {
                showLoggedIn();
            });
    });

    // Setup signup view
    $("#signup-view #signup-form").submit(function (e) {
        e.preventDefault();
        var form = $(this);
        var signupData = extractFormInput(form);

        signup()
            .done(function (response) {
                alert("You just created a new user");
                form.trigger("reset");
                updateAuthStatus();
            })
            .fail(function (response) {
                alert("Something went wrong")
            })
    });
});


// Helpers
function updateAuth() {
    verifyAuth()
        .done(function (response) {
            showLoggedIn(response.data.username)
        })
        .fail(function (response) {
            showLoggedout()
        })
}

function extractFormInput(form) {
    var inputs = form.serializeArray();
    var data   = {};
    $.each(inputs, function (index, input) {
        data[input.name] = input.value
    });
    return data;
}

function showLoggedIn(username) {
    // Show logged in view and show username
    $("#logged-in-view span").text(username);
    $("#logged-out-view").addClass("hidden");
    $("#logged-in-view").removeClass("hidden");
}

function showLoggedout() {
    // Show logged out view
    $("#logged-out-view").removeClass("hidden");
    $("#logged-in-view").addClass("hidden");
}

// API calls
function verifyAuth (callback) {
    var url = "/api/auth/verify_auth";
    return $.get(url);
}

function login(loginData) {
    var url = "/api/auth/login";
    return $.post(url, loginData);
}

function logout () {
    var url = "/api/auth/logout";
    return $.post(url);
}

function signup(signupData) {
    var url = "/api/auth/signup";
    return $.post(url, signupData);
}
