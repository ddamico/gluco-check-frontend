import React from "react";
import { useForm } from "react-hook-form";

export default function SettingsForm() {
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name="nightscout.url" ref={register({ required: true })} />
      <input name="nightscout.token" ref={register({ required: true })} />
      <select name="glucoseUnit">
        <option id="mg/dl">mg/dl</option>
        <option id="mmol/l">mmol/l</option>
      </select>
      <input type="submit" />
    </form>
  );
}
