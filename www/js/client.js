$(function() {



    if (typeof(Storage) !== "undefined") {

        if (sessionStorage.getItem("signedin") === "true") {
            $("#signinout").text("sign out");
            $("#content").fadeIn(1000);
        } else {
            $("#signinout").text("sign in");
            $("#content").fadeOut(1000);
        }
    }



    var accountid, documentwidth, documentheight, formsubmitted = false,
        resultprepared = false;

    $("#signinout").click(function() {

        if ($("#signinout").text() === "sign in")

        {

            if (typeof(Storage) !== "undefined") {
                
                sessionStorage.setItem("signedin", "true");
                $("#signinout").text("sign out");


            } else {

            }


            window.location.replace("https://developer.api.autodesk.com/authentication/v1/authorize?response_type=code&client_id=REDACTED&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fforge%2Fcallback%2Foauth&scope=data:read");

        } else {
            $("#content").fadeOut(1000);
            sessionStorage.removeItem("signedin");
            $("#signinout").text("sign in");
            iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = "https://accounts.autodesk.com/Authentication/LogOut";

            iframe.onload = function() {
                
                window.location.href = "localhost:3000";
            };
            document.body.appendChild(iframe);
            

        }

    });



    $("#help").click(function() {

        $("#helpmodal").click();

    });

    $("#provisioning").click(function() {

        $("#provisioningmodal-1").click();


    });




    $("form").submit(function(event) {




        event.preventDefault();

        formsubmitted = true;
        accountid = $("#accountid").val();

        documentwidth = parseInt($("#documentwidth").val());
        documentheight = parseInt($("#documentheight").val());




        $.post("/?" + $.param({
            accountid: accountid
        }), function(data) {
            



            try {

                var jsondata = JSON.parse(data["projects"]);



                jsondata.unshift({
                    "id": "id",
                    "account_id": "account id",
                    "name": "name",
                    "start_date": "start date",
                    "end_date": "end date",
                    "value": "value",
                    "currency": "currency",
                    "status": "status",
                    "job_number": "job number",
                    "address_line_1": "address line 1",
                    "address_line_2": "address line 2",
                    "city": "city",
                    "state_or_province": "state or province",
                    "postal_code": "postal code",
                    "country": "country",
                    "business_unit_id": "business unit id",
                    "created_at": "created at",
                    "updated_at": "updated at",
                    "project_type": "project type",
                    "timezone": "timezone",
                    "language": "language",
                    "construction_type": "construction type",
                    "contract_type": "contract type",
                    "last_sign_in": "last sign in"
                });
                $.jsontotable(jsondata, {
                    id: "#resultintermediate",
                    header: false
                });
                $("#resultprojects").html($("#resultintermediate").html().replace(/null/g, "").toUpperCase());
                $("#resultintermediate").html("");

                var jsondata = JSON.parse(data["companies"]);



                jsondata.unshift({
                    "id": "id",
                    "account_id": "account id",
                    "name": "name",
                    "trade": "trade",
                    "address_line_1": "address line 1",
                    "address_line_2": "address line 2",
                    "city": "city",
                    "postal_code": "postal code",
                    "state_or_province": "state or province",
                    "country": "country",
                    "phone": "phone",
                    "website_url": "website url",
                    "description": "description",
                    "created_at": "created at",
                    "updated_at": "updated at",
                    "erp_id": "erp id",
                    "tax_id": "tax id"
                });
                $.jsontotable(jsondata, {
                    id: "#resultintermediate",
                    header: false
                });
                $("#resultcompanies").html($("#resultintermediate").html().replace(/null/g, "").toUpperCase());
                $("#resultintermediate").html("");



                var jsondata = JSON.parse(data["users"]);



                jsondata.unshift({
                    "id": "id",
                    "email": "email",
                    "name": "name",
                    "nickname": "nickname",
                    "first_name": "first name",
                    "last_name": "last name",
                    "uid": "uid",
                    "image_url": "image url",
                    "address_line_1": "address line 1",
                    "address_line_2": "address line 2",
                    "city": "city",
                    "postal_code": "postal code",
                    "state_or_province": "state or province",
                    "country": "country",
                    "phone": "phone",
                    "company": "company",
                    "job_title": "job title",
                    "industry": "industry",
                    "about_me": "about me",
                    "created_at": "created at",
                    "updated_at": "updated at",
                    "account_id": "account id",
                    "role": "role",
                    "status": "status",
                    "company_id": "company id",
                    "company_name": "company name",
                    "last_sign_in": "last sign in"
                });
                $.jsontotable(jsondata, {
                    id: "#resultintermediate",
                    header: false
                });
                $("#resultusers").html($("#resultintermediate").html().replace(/null/g, "").toUpperCase());
                $("#resultintermediate").html("");



                




                var jsondata = JSON.parse(data["business_units_structure"]).business_units || [];




                jsondata.unshift({
                    "id": "id",
                    "account_id": "account id",
                    "parent_id": "parent id",
                    "name": "name",
                    "path": "path",
                    "created_at": "created at",
                    "updated_at": "updated at",
                    "description": "description"
                });
                $.jsontotable(jsondata, {
                    id: "#resultintermediate",
                    header: false
                });
                $("#resultbusinessunits").html($("#resultintermediate").html().replace(/null/g, "").toUpperCase());
                $("#resultintermediate").html("");




                $("#result").fadeIn(1000);

                resultprepared = true;


            } catch (e) {
                console.log("ERROR");

            }

        });



    });


    $("#save").click(function() {

        if (formsubmitted === false || resultprepared === false) {
            console.log("ERROR");

            return;
        }




        var doc = new jsPDF("l", "mm", [documentwidth || 1920, documentheight || 1080]);

        doc.setFontSize(40);

        doc.text("BIM 360 ACCOUNT DATA", 14, 20);

        doc.setFontSize(12);

        doc.text("PROJECTS", 14, 40);


        var res = doc.autoTableHtmlToJson($("#resultprojects").find("table")[0]);
        doc.autoTable(res.columns, res.data, {
            startY: 42,
            theme: "grid",
            styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineColor: [0, 0, 0],
                borderColor: [0, 0, 0],
                overflow: "linebreak",
                columnWidth: "wrap"
            },
            headerStyles: {
                fillColor: [0, 0, 0],
                textColor: [255, 255, 255],
                lineColor: [0, 0, 0],
                borderColor: [0, 0, 0]
            },
            columnStyles: {
                text: {
                    columnWidth: "auto"
                }
            }
        });

        doc.text("COMPANIES", 14, doc.autoTable.previous.finalY + 10);


        res = doc.autoTableHtmlToJson($("#resultcompanies").find("table")[0]);
        doc.autoTable(res.columns, res.data, {
            startY: doc.autoTable.previous.finalY + 12,
            theme: "grid",
            styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineColor: [0, 0, 0],
                borderColor: [0, 0, 0],
                overflow: "linebreak",
                columnWidth: "wrap"
            },
            headerStyles: {
                fillColor: [0, 0, 0],
                textColor: [255, 255, 255],
                lineColor: [0, 0, 0],
                borderColor: [0, 0, 0]
            },
            columnStyles: {
                text: {
                    columnWidth: "auto"
                }
            }
        });


        doc.text("USERS", 14, doc.autoTable.previous.finalY + 10);
        res = doc.autoTableHtmlToJson($("#resultusers").find("table")[0]);
        doc.autoTable(res.columns, res.data, {
            startY: doc.autoTable.previous.finalY + 12,
            theme: "grid",
            styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineColor: [0, 0, 0],
                borderColor: [0, 0, 0],
                overflow: "linebreak",
                columnWidth: "wrap"
            },
            headerStyles: {
                fillColor: [0, 0, 0],
                textColor: [255, 255, 255],
                lineColor: [0, 0, 0],
                borderColor: [0, 0, 0]
            },
            columnStyles: {
                text: {
                    columnWidth: "auto"
                }
            }
        });


        doc.text("BUSINESS UNITS", 14, doc.autoTable.previous.finalY + 10);
        res = doc.autoTableHtmlToJson($("#resultbusinessunits").find("table")[0]);
        doc.autoTable(res.columns, res.data, {
            startY: doc.autoTable.previous.finalY + 12,
            theme: "grid",
            styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineColor: [0, 0, 0],
                borderColor: [0, 0, 0],
                overflow: "linebreak",
                columnWidth: "wrap"
            },
            headerStyles: {
                fillColor: [0, 0, 0],
                textColor: [255, 255, 255],
                lineColor: [0, 0, 0],
                borderColor: [0, 0, 0]
            },
            columnStyles: {
                text: {
                    columnWidth: "auto"
                }
            }
        });


        doc.save("file-bim-360-account-data.pdf");
        console.log("SUCCESS");




        



    });



});