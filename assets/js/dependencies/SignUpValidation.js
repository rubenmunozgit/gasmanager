$(document).ready(function() {
    $('#SignUpForm').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'fa fa-check',
            invalid: 'fa fa-close',
            validating: 'fa fa-refresh'
        },
        fields: {
            name: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: 'The username is required and cannot be empty'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: 'The username must be more than 6 and less than 30 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9]+$/,
                        message: 'The username can only consist of alphabetical and number'
                    },
                    different: {
                        field: 'encrypPassword',
                        message: 'The username and password cannot be the same as each other'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email address is required and cannot be empty'
                    },
                    emailAddress: {
                        message: 'The email address is not a valid'
                    }
                }
            },
            encrypPassword: {
                validators: {
                    notEmpty: {
                        message: 'The password is required and cannot be empty'
                    },
                    different: {
                        field: 'name',
                        message: 'The password cannot be the same as username'
                    },
                    identical: {
                            field: 'confirmPassword',
                            message: 'The password and its confirm must be the same'
                        },
                    stringLength: {
                        min: 8,
                        message: 'The password must have at least 8 characters'
                    }
                }
            },
            confirmPassword: {
              validators: {
                notEmpty: {
                        message: 'The confirmation password is required and cannot be empty'
                    },
                    different: {
                        field: 'name',
                        message: 'The confirm password cannot be the same as username'
                    },
                    identical: {
                            field: 'encrypPassword',
                            message: 'The password and its confirm must be the same'
                        },
                    stringLength: {
                        min: 8,
                        message: 'The password must have at least 8 characters'
                    }
              }
            }
        }
    });
});