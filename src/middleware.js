import { NextResponse } from "next/server";

export default function middleware(req) {
    let verify = true; //req.cookies.get("loggedin") ? true : false;
    let url = req.url
    console.log("url", url);

    // check cookie based authentication
    // if (!verify && url != "http://localhost:3000/login") {
    //     return NextResponse.redirect("http://localhost:3000/login");
    // }


    if (verify && url === "http://localhost:3000/login") {
        return NextResponse.redirect("http://localhost:3000/brands");
    }


    // if (!verify) {





    //     console.log("!verify", verify);
    //     return NextResponse.redirect("http://localhost:3000/login");


    // }
}