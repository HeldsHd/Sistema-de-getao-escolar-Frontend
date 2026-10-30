"use server";

import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export async function login( formData: FormData ) {
    const email = formData.get("email");
    const senha = formData.get("senha");

    let response: Response
    try {
        response = await fetch(`${process.env.API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                senha
            })
        });
    } catch (e) {
        console.error(e);
        return "Erro ao comunicar com o servidor";
    }

    const data = await response.json();

    console.log(response.status, data)
    if(response.status !== 200) {
        return
    }

  const cookieStrore = await cookies();
  cookieStrore.set("@gestao-escolar/token", data);
  redirect("/profile")

}