import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";

export default function CreateNadeModal() {
  const { user } = useUser();
  const ctx = api.useContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [videoUrl, setVideoUrl] = useState("");
  const [nade, setNade] = useState({
    game: "",
    map: "",
    start: "",
    end: "",
    type: "",
    team: "",
    tick: "",
    technique: "",
    description: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setNade((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    mutate({ ...nade, videoUrl: videoUrl });
  };

  const { mutate, isLoading: isPosting } = api.nades.create.useMutation({
    onSuccess: () => {
      setNade({
        game: "",
        map: "",
        start: "",
        end: "",
        type: "",
        team: "",
        tick: "",
        technique: "",
        description: "",
      });
      setVideoUrl("");
      onClose();
      toast.success("Added nade.");
      void ctx.nades.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to add nade.");
      }
    },
  });

  if (!user) return null;

  return (
    <>
      <Button onClick={onOpen} bg={"whitesmoke"}>
        Add Nade
      </Button>
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg="modal.bg" as="form">
          <ModalHeader>Add New Nade</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            {/* Game Listbox */}
            <div className="flex gap-x-4">
              <FormControl pb={2} isRequired>
                <FormLabel>Game</FormLabel>
                <Select
                  name="game"
                  value={nade.game}
                  placeholder="Select game"
                  onChange={(e) => handleChange(e)}
                >
                  <option value="CS:GO" style={{ color: "black" }}>
                    CS:GO
                  </option>
                  <option value="CS2" style={{ color: "black" }}>
                    CS2
                  </option>
                </Select>
              </FormControl>
              {/* Map Listbox */}
              <FormControl pb={2} isRequired>
                <FormLabel>Map</FormLabel>
                <Select
                  name="map"
                  value={nade.map}
                  placeholder="Select map"
                  onChange={(e) => handleChange(e)}
                >
                  <option style={{ color: "black" }} value="Mirage">
                    Mirage
                  </option>
                  <option style={{ color: "black" }} value="Inferno">
                    Inferno
                  </option>
                  <option style={{ color: "black" }} value="Dust2">
                    Dust2
                  </option>
                  <option style={{ color: "black" }} value="Nuke">
                    Nuke
                  </option>
                  <option style={{ color: "black" }} value="Overpass">
                    Overpass
                  </option>
                  <option style={{ color: "black" }} value="Vertigo">
                    Vertigo
                  </option>
                  <option style={{ color: "black" }} value="Ancient">
                    Ancient
                  </option>
                  <option style={{ color: "black" }} value="Anubis">
                    Anubis
                  </option>
                </Select>
              </FormControl>
            </div>
            {/* Nade Start to End Position */}
            <FormControl pb={2} isRequired>
              <div className="flex gap-x-4">
                <span>
                  <FormLabel>Start Location</FormLabel>
                  <Input
                    type="text"
                    name="start"
                    value={nade.start}
                    placeholder="Start Location"
                    onChange={handleChange}
                  />
                </span>
                <span>
                  <FormLabel>End Location</FormLabel>
                  <Input
                    type="text"
                    name="end"
                    value={nade.end}
                    placeholder="End Location"
                    onChange={handleChange}
                  />
                </span>
              </div>
            </FormControl>
            <FormControl isRequired pb={2}>
              <div className="flex gap-x-8">
                <div>
                  <FormLabel>Type of Grenade</FormLabel>
                  <div className="flex gap-x-6">
                    <div className="flex gap-x-1">
                      <input
                        type="radio"
                        required
                        id="Smoke"
                        name="type"
                        value="Smoke"
                        className="hidden"
                        checked={nade.type === "Smoke"}
                        onChange={handleChange}
                      />
                      <label
                        className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-md rounded-r-none bg-zinc-800"
                        htmlFor="Smoke"
                      >
                        <img src="/smoke-logo.webp" alt="Smoke" />
                      </label>

                      <input
                        type="radio"
                        required
                        id="Flash"
                        name="type"
                        value="Flash"
                        className="hidden"
                        checked={nade.type === "Flash"}
                        onChange={handleChange}
                      />
                      <label
                        className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-md rounded-l-none rounded-r-none bg-zinc-800"
                        htmlFor="Flash"
                      >
                        <img
                          src="/flash-logo.webp"
                          alt="Flash"
                          className="mr-0.5 scale-90" //idk why this needs a margin-right
                        />
                      </label>

                      <input
                        type="radio"
                        required
                        id="Nade"
                        name="type"
                        value="Nade"
                        className="hidden"
                        checked={nade.type === "Nade"}
                        onChange={handleChange}
                      />
                      <label
                        className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-md rounded-l-none rounded-r-none bg-zinc-800"
                        htmlFor="Nade"
                      >
                        <img
                          src="/grenade-logo.webp"
                          alt="Nade"
                          className="scale-125"
                        />
                      </label>

                      <input
                        type="radio"
                        required
                        id="Molotov"
                        name="type"
                        value="Molotov"
                        className="hidden"
                        checked={nade.type === "Molotov"}
                        onChange={handleChange}
                      />
                      <label
                        className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-md rounded-l-none bg-zinc-800"
                        htmlFor="Molotov"
                      >
                        <img
                          src="/molly-logo.webp"
                          alt="Molotov"
                          className="scale-125"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {/* Team */}
                <div>
                  <FormLabel>Team</FormLabel>
                  <div className="flex gap-x-6">
                    <div className="flex gap-x-1">
                      <input
                        type="radio"
                        required
                        id="t-side"
                        value="Terrorist"
                        className="hidden"
                        name="team"
                        checked={nade.team === "Terrorist"}
                        onChange={handleChange}
                      />
                      <label
                        className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-md rounded-r-none bg-zinc-800 p-1"
                        htmlFor="t-side"
                      >
                        <img src="/t-logo.webp" alt="Terrorist" />
                      </label>

                      <input
                        type="radio"
                        required
                        id="both"
                        value="Both"
                        className="hidden"
                        name="team"
                        checked={nade.team === "Both"}
                        onChange={handleChange}
                      />
                      <label
                        className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-md rounded-l-none rounded-r-none bg-zinc-800 p-1"
                        htmlFor="both"
                      >
                        <img src="/t-ct-logo.webp" alt="Both" />
                      </label>

                      <input
                        type="radio"
                        required
                        id="ct-side"
                        value="Counter-Terrorist"
                        className="hidden"
                        name="team"
                        checked={nade.team === "Counter-Terrorist"}
                        onChange={handleChange}
                      />
                      <label
                        className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-md rounded-l-none bg-zinc-800 p-1"
                        htmlFor="ct-side"
                      >
                        <img src="/ct-logo.webp" alt="Counter-Terrorist" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </FormControl>

            <FormControl isRequired pb={2}>
              <div className="flex gap-x-12">
                <div>
                  <FormLabel>Tick Rate</FormLabel>
                  <div className="flex gap-x-1 pb-4">
                    <input
                      type="radio"
                      required
                      id="64tick"
                      value="64"
                      className="hidden"
                      name="tick"
                      checked={nade.tick === "64"}
                      onChange={handleChange}
                    />
                    <label
                      className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-md rounded-r-none bg-zinc-800"
                      htmlFor="64tick"
                    >
                      <p className="text-md inline font-semibold text-text">
                        64
                      </p>
                    </label>

                    <input
                      type="radio"
                      required
                      id="bothtick"
                      value="Both"
                      className="hidden"
                      name="tick"
                      checked={nade.tick === "Both"}
                      onChange={handleChange}
                    />
                    <label
                      className="flex h-8 w-12 cursor-pointer items-center justify-center bg-zinc-800"
                      htmlFor="bothtick"
                    >
                      <p className="text-md inline font-semibold text-text">
                        Both
                      </p>
                    </label>

                    <input
                      type="radio"
                      required
                      id="128tick"
                      value="128"
                      className="hidden"
                      name="tick"
                      checked={nade.tick === "128"}
                      onChange={handleChange}
                    />
                    <label
                      className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-md rounded-l-none bg-zinc-800"
                      htmlFor="128tick"
                    >
                      <p className="text-md inline font-semibold text-text">
                        128
                      </p>
                    </label>
                  </div>
                </div>

                {/* Technique */}
                <div>
                  <FormLabel>Technique</FormLabel>
                  <div className="flex gap-x-6">
                    <div className="flex gap-x-1">
                      <input
                        type="radio"
                        required
                        id="left-click"
                        value="Left-Click"
                        className="hidden"
                        name="technique"
                        checked={nade.technique === "Left-Click"}
                        onChange={handleChange}
                      />
                      <label
                        className="flex h-full w-full cursor-pointer items-center justify-center rounded-md rounded-r-none bg-zinc-800"
                        htmlFor="left-click"
                      >
                        <img
                          className="m-auto block aspect-square w-10"
                          src="/leftclick.svg"
                          alt="Left-Click"
                        />
                      </label>

                      <input
                        type="radio"
                        required
                        id="middle-click"
                        value="Middle-Click"
                        className="hidden"
                        name="technique"
                        checked={nade.technique === "Middle-Click"}
                        onChange={handleChange}
                      />
                      <label
                        className="flex h-full w-full cursor-pointer items-center justify-center rounded-md rounded-l-none rounded-r-none bg-zinc-800"
                        htmlFor="middle-click"
                      >
                        <img
                          className="m-auto block aspect-square w-10"
                          src="/middleclick.svg"
                          alt="Middle-Click"
                        />
                      </label>

                      <input
                        type="radio"
                        required
                        id="right-click"
                        value="Right-Click"
                        className="hidden"
                        name="technique"
                        checked={nade.technique === "Right-Click"}
                        onChange={handleChange}
                      />
                      <label
                        className="flex h-full w-full cursor-pointer items-center justify-center rounded-md rounded-l-none bg-zinc-800"
                        htmlFor="right-click"
                      >
                        <img
                          className="m-auto block aspect-square w-10"
                          src="/rightclick.svg"
                          alt="Right-Click"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormControl isRequired>
              <div className="flex flex-col gap-2">
                <div className="inline">
                  <span>
                    <FormLabel>Video</FormLabel>
                    <Input
                      type="text"
                      name="video"
                      placeholder="Enter Video URL..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (videoUrl !== "") {
                            mutate({
                              game: "",
                              map: "",
                              start: "",
                              end: "",
                              type: "",
                              team: "",
                              tick: "",
                              technique: "",
                              videoUrl: videoUrl,
                              description: "",
                            });
                          }
                        }
                      }}
                    />
                  </span>
                </div>
                <div className="inline">
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    name="description"
                    value={nade.description}
                    placeholder="Describe the nade..."
                    onChange={handleChange}
                  />
                </div>
              </div>
            </FormControl>
          </ModalBody>

          <Button
            onClick={handleSubmit}
            disabled={isPosting}
            className="mx-6 my-4"
            bgColor={"blue.500"}
          >
            Add Nade
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
}
