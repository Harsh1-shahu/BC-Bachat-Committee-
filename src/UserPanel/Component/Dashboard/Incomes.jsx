import { FiTrendingUp } from "react-icons/fi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { GiAbstract062, GiAbstract083, GiAvoidance } from "react-icons/gi";
import { useProject } from "../../../Context/ProjectContext";

//  Card Component (WITH inline loading)
const StatCard = ({ icon: Icon, amount, label, gradient, loading }) => (
  <div
    className={`p-2 md:p-4 rounded-xl shadow-md flex flex-col text-white transition-all duration-300 
                bg-linear-to-br ${gradient}`}
  >
    {/* Header */}
    <div className="flex items-center gap-2">
      <div className="p-1 bg-white/20 rounded-lg flex items-center justify-center">
        <Icon size={22} />
      </div>
      <p className="text-sm font-bold text-white/90">{label}</p>
    </div>

    {/* Amount Row */}
    <div className="flex justify-between items-center mt-3">

      {loading ? (
        //  INLINE LOADING EFFECT
        <div className="w-16 h-4 bg-white/30 rounded animate-pulse"></div>
      ) : (
        <h3 className="text-sm md:text-lg font-semibold">
          ₹{amount}
        </h3>
      )}

      <p className="text-xs md:text-md text-white/80 flex items-center gap-1">
        <FiTrendingUp size={12} /> +10%
      </p>
    </div>
  </div>
);

const Incomes = () => {
  const { dashboardIncomeData, loading } = useProject();

  const incomeData = [
    {
      icon: GiAbstract062,
      amount: dashboardIncomeData.Commando_Income,
      label: "Commando Income",
      gradient: "from-green-400 to-green-600",
    },
    {
      icon: GiAbstract083,
      amount: dashboardIncomeData.Cut_off_Income,
      label: "Cut-off Income",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      icon: GiAvoidance,
      amount: dashboardIncomeData.Incentive_Income,
      label: "Incentive Income",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: RiMoneyDollarCircleLine,
      amount: dashboardIncomeData.Total_Income,
      label: "Total Income",
      gradient: "from-sky-400 to-sky-500",
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-md p-2">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {incomeData.map((item, index) => (
            <StatCard key={index} {...item} loading={loading} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Incomes;
