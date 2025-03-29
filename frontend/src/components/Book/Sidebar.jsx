import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Sidebar = ({ selectedVoice, handleVoiceChange }) => {
  return (
    <div className="bg-white text-black w-64 p-4 flex flex-col rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">Settings</h3>
      {/* Voice Selection Dropdown */}
      <div className="mb-4">
        <Label htmlFor="voiceSelect" className="text-sm font-medium mb-2">
          Select Voice:
        </Label>
        <Select
          value={`${selectedVoice.name.split('-').pop()},${selectedVoice.ssmlGender}`}
          onValueChange={(value) => handleVoiceChange({ target: { value } })}
        >
          <SelectTrigger className=" text-black focus:ring-2 focus:ring-gray-500">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black border-gray-700">
            <SelectItem value="A,MALE" className="">
              en-US-Wavenet-A (Male)
            </SelectItem>
            <SelectItem value="B,MALE" className="">
              en-US-Wavenet-B (Male)
            </SelectItem>
            <SelectItem value="C,FEMALE" className="">
              en-US-Wavenet-C (Female)
            </SelectItem>
            <SelectItem value="D,MALE" className="">
              en-US-Wavenet-D (Male)
            </SelectItem>
            <SelectItem value="E,FEMALE" className="">
              en-US-Wavenet-E (Female)
            </SelectItem>
            <SelectItem value="F,FEMALE" className="">
              en-US-Wavenet-F (Female)
            </SelectItem>
            <SelectItem value="G,FEMALE" className="">
              en-US-Wavenet-G (Female)
            </SelectItem>
            <SelectItem value="H,MALE" className="">
              en-US-Wavenet-H (Male)
            </SelectItem>
            <SelectItem value="I,MALE" className="">
              en-US-Wavenet-I (Male)
            </SelectItem>
            <SelectItem value="J,MALE" className="">
              en-US-Wavenet-J (Male)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Sidebar;