/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useState } from "react";
import classes from "./Card.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import router from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useStore } from "../../database/token";
import { gql, useMutation } from "@apollo/client";
import { ME } from "./Profile";
type Props = {};
const UPLOAD = gql`
  mutation UploadFIle($file: Upload!) {
    uploadFile(file: $file) {
      id
      path
    }
  }
`;

const EDIT = gql`
  mutation EditProfile($data: EditProfile!) {
    editProfile(data: $data)
  }
`;

interface FormValues {
  name: string;
  gender: string;
  country: string;
  image: string;
}

const schema = yup
  .object({
    name: yup.string().min(4).required(),
    gender: yup.string().min(4).required(),
    country: yup.string().min(4).required(),
  })
  .required();

function Complete({}: Props) {
  const { accessToken, setAccessToken } = useStore();
  const [UPLOAD_ACCESS] = useMutation(UPLOAD);
  const [EDIT_ACCESS] = useMutation(EDIT);
  console.log(accessToken);
  const [files, setFiles] = useState<string | null>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data1: FormValues) => {
    if (files != null && files != "") {
      {
        const response = await EDIT_ACCESS({
          variables: {
            data: {
              name: data1.name,
              gender: data1.gender,
              country: data1.country,
              image: files,
            },
          },
          context: {
            headers: {
              authorization: "bearer " + accessToken,
            },
          },
          refetchQueries: [{ query: ME }],
        });
        console.log(response);
        router.push("/components/Profile");
      }
      console.log(data1);
      console.log(files);
      return;
    }
    setFiles(null);
  };
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const response = await UPLOAD_ACCESS({
        variables: {
          file: acceptedFiles[0],
        },
        context: {
          headers: {
            authorization: "bearer " + accessToken,
          },
        },
      });
      setFiles(
        "https://a-auth.herokuapp.com/" +
          response.data.uploadFile.path.replace("upload", "uploads")
      );
    },
    [UPLOAD_ACCESS, accessToken]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  return (
    <div className={classes.complete}>
      <h1>Complete your profile</h1>
      <br />
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <input
          {...register("name", { required: true })}
          placeholder="Name"
          className={classes.textarea}
        />
        {<p style={{ color: "red" }}>{errors.name?.message}</p>}

        <input
          {...register("gender", {
            required: true,
          })}
          placeholder="Gender"
          className={classes.textarea}
        />
        {<p style={{ color: "red" }}>{errors.gender?.message}</p>}
        <input
          {...register("country", { required: true })}
          placeholder="Country"
          className={classes.textarea}
        />
        {<p style={{ color: "red" }}>{errors.country?.message}</p>}
        <div
          {...getRootProps()}
          className={classes.imagedrop}
          style={{
            backgroundImage: `url(${files || ""})`,
          }}
        >
          <input {...getInputProps()} />
          {(files == "" || files == null) && <p>DROP YOUR IMAGE HERE</p>}
        </div>
        {files === null && (
          <p style={{ color: "red" }}>⚠️ This field is required</p>
        )}
        <br />

        <br />
        <input
          type="submit"
          value="Complete your profile"
          className={classes.button}
        />
      </form>
    </div>
  );
}

export default Complete;
