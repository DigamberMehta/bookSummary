import { Card, CardContent } from "@/components/ui/card";
import { FaUserGraduate } from "react-icons/fa";
import { motion } from "framer-motion";

const teamMembers = [
  { name: "Digamber Singh Mehta", regNo: "12323103" },
  { name: "Srishti", regNo: "12313585" },
  { name: "Taiba Siraj", regNo: "12312313" },
];

export default function TeamSection() {
  return (
    <div className="bg-white text-gray-900 py-12 px-6 text-center flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center"
          >
            <Card className="bg-gray-100 border-gray-300 rounded-2xl shadow-lg w-64">
              <CardContent className="p-6 flex flex-col items-center">
                <FaUserGraduate className="text-5xl text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">Reg No: {member.regNo}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}