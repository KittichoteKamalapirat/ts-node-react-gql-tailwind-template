import IconButton from "@/components/Buttons/IconButton";
import { PencilSquare } from "@styled-icons/bootstrap";
import { DeleteBin } from "@styled-icons/remix-line";
import React from "react";
import { useDeletePostMutation } from "../generated/graphql";
import { urlResolver } from "../lib/UrlResolver";
import Button, { ButtonTypes } from "./Buttons/Button";

interface EditDeletePostButtonsProps {
  id: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
}) => {
  const [deletePost] = useDeletePostMutation();

  const handleDeletePost = () => {
    deletePost({
      variables: { id },
      update: (cache) => {
        cache.evict({ id: "Post:" + id }); //Post: 60
      },
    });
  };
  return (
    <div>
      <Button
        label=""
        startIcon={<PencilSquare height={20} width={20} />}
        href={urlResolver.editPost(String(id))}
        type={ButtonTypes.TEXT}
      />
      <IconButton
        onClick={handleDeletePost}
        label="delete-icon"
        icon={<DeleteBin height={20} width={20} />}
      />
    </div>
  );
};
