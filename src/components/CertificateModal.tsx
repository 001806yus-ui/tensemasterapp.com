import React from 'react';
import { useUser } from '../context/UserContext';
import { X, Printer, Award, CheckCircle2, ShieldCheck, FileDown } from 'lucide-react';

interface CertificateModalProps {
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ onClose }) => {
  const { progressState, overallMasteryPercentage, exportProgressPDF } = useUser();

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certificateId = `ENG-12T-${Math.abs(
    progressState.userName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 1042)
  )}-${new Date().getFullYear()}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden print:shadow-none print:border-0 transition-colors">
        
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Certificado de Acreditación Oficial</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportProgressPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Descargar archivo PDF oficial de progreso y certificación"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Descargar PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Frame */}
        <div className="p-8 sm:p-12 bg-radial from-amber-50/40 via-white to-slate-50 relative border-8 border-double border-slate-200 m-4 rounded-xl text-center">
          
          {/* Subtle Watermark Emblem */}
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <img
              src="/src/assets/images/badge_mastery_trophy_1791427377846.jpg"
              alt="Insignia de dominio"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-full shadow-md"
            />
          </div>

          {/* Institution Header */}
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
            TenseMaster International English Academy
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Certificado de Dominio de los 12 Tiempos
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-serif italic">
            Por el presente documento se certifica que:
          </p>

          {/* Student Name */}
          <div className="my-6">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-indigo-900 border-b-2 border-indigo-200 inline-block px-8 py-2">
              {progressState.userName}
            </div>
          </div>

          {/* Statement */}
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Ha completado satisfactoriamente el programa de entrenamiento de los <strong>12 Tiempos Gramaticales del Idioma Inglés</strong> (Pasado, Presente, Futuro en aspectos Simple, Continuo, Perfecto y Perfecto Continuo), demostrando competencia en formulación, comprensión auditiva nativa y aplicación conversacional.
          </p>

          {/* Verification Badges */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-xs text-slate-500">
            <div>
              <span className="block font-bold text-slate-800">Fecha de Emisión</span>
              <span className="font-mono">{currentDate}</span>
            </div>
            <div>
              <span className="block font-bold text-slate-800">Dominio Registrado</span>
              <span className="font-mono text-indigo-700 font-bold">{overallMasteryPercentage}%</span>
            </div>
            <div>
              <span className="block font-bold text-slate-800">ID de Acreditación</span>
              <span className="font-mono">{certificateId}</span>
            </div>
          </div>

          {/* Seal */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-emerald-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Documento digital verificado con validez curricular de formación continua</span>
          </div>

        </div>

      </div>
    </div>
  );
};
