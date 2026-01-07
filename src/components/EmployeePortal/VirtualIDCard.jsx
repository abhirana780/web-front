import logo from '../../assets/logo.png';
import { FiMapPin, FiAward, FiShield } from 'react-icons/fi';

const VirtualIDCard = ({ employee }) => {
    if (!employee) return null;

    return (
        <div className="relative w-full max-w-[310px] mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transform transition hover:scale-[1.02] duration-300 border border-gray-200" style={{ height: '500px' }}>
            {/* Lanyard Hole */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-200 rounded-full z-20"></div>
            
            {/* Design Header */}
            <div className="h-32 bg-gradient-to-br from-[#ab1428] via-[#8b0f1f] to-[#5a0a14] relative flex justify-center items-end pb-12 rounded-b-[50%] shadow-md">
                 <div className="absolute top-8 left-0 w-full text-center">
                    <img src={logo} alt="Wipronix" className="h-8 mx-auto brightness-0 invert opacity-90" />
                    <p className="text-[10px] text-white/70 uppercase tracking-[0.2em] mt-1">Employee Identity</p>
                 </div>
            </div>

            {/* Profile Image */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-28 h-28 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-gray-100">
                    <img 
                        src={employee.profileImage || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=ab1428&color=fff&size=256`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-green-500 text-white text-[10px] font-bold px-4 py-0.5 rounded-full shadow-md border-2 border-white tracking-wider">
                    ACTIVE
                </div>
            </div>

            {/* Content */}
            <div className="pt-28 px-4 text-center space-y-1">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight leading-snug">
                    {employee.firstName} {employee.lastName}
                </h2>
                <p className="text-[#ab1428] font-bold text-xs uppercase tracking-wider">{employee.designation}</p>
                
                <div className="flex justify-center items-center space-x-2 mt-3 mb-5">
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest border border-gray-200">
                        {employee.employeeId}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-left border-t border-gray-100 pt-6">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Department</p>
                        <div className="flex items-center text-gray-700 text-xs font-semibold mt-1">
                            <FiAward className="mr-1.5 text-[#ab1428]" />
                            <span className="truncate">{employee.department}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Location</p>
                        <div className="flex items-center text-gray-700 text-xs font-semibold mt-1">
                            <FiMapPin className="mr-1.5 text-[#ab1428]" />
                            <span className="truncate">Wipronix HQ</span>
                        </div>
                    </div>
                </div>
                
                 <div className="mt-4 pt-4 border-t border-gray-100 text-left">
                     <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Authorization</p>
                     <div className="flex items-center gap-2">
                        <FiShield className="text-[#ab1428]" />
                        <p className="text-[10px] text-gray-500 leading-tight">This card is property of Wipronix Technologies. If found, please return to HR.</p>
                     </div>
                 </div>
            </div>

            {/* Background Watermark */}
            <img src={logo} className="absolute bottom-20 right-[-20%] w-[80%] opacity-[0.03] rotate-[-20deg] pointer-events-none" />
        </div>
    );
};

export default VirtualIDCard;
