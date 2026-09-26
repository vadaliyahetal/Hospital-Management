import { Request, Response } from 'express';
import { initialBeds, Bed } from '../data/mockStore.js';

let bedsStore: Bed[] = [...initialBeds];

export const getBeds = (req: Request, res: Response) => {
  try {
    const { status, ward_type } = req.query;
    let list = [...bedsStore];

    if (status) {
      list = list.filter(b => b.status.toLowerCase() === String(status).toLowerCase());
    }
    if (ward_type) {
      list = list.filter(b => b.ward_type.toLowerCase() === String(ward_type).toLowerCase());
    }

    const total = bedsStore.length;
    const occupied = bedsStore.filter(b => b.status === 'Occupied').length;
    const available = bedsStore.filter(b => b.status === 'Available').length;
    const cleaning = bedsStore.filter(b => b.status === 'Cleaning' || b.status === 'Maintenance').length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

    return res.json({
      success: true,
      stats: { total, occupied, available, cleaning, occupancyRate },
      data: list
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const allocateBed = (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { patient_name, uhid } = req.body;

    const bed = bedsStore.find(b => b.id === id);
    if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' });

    if (bed.status === 'Occupied') {
      return res.status(400).json({ success: false, message: `Bed ${bed.bed_number} is already occupied!` });
    }

    bed.status = 'Occupied';
    bed.patient_name = patient_name || 'In-Patient';
    bed.uhid = uhid || 'UHID-2026-TEMP';
    bed.admission_date = new Date().toISOString().split('T')[0];

    return res.json({
      success: true,
      message: `Bed ${bed.bed_number} allocated to ${bed.patient_name}`,
      data: bed
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const dischargeBed = (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const bed = bedsStore.find(b => b.id === id);
    if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' });

    const dischargedPatient = bed.patient_name;
    bed.status = 'Cleaning';
    bed.patient_name = undefined;
    bed.uhid = undefined;
    bed.admission_date = undefined;

    return res.json({
      success: true,
      message: `Patient ${dischargedPatient || ''} discharged from ${bed.bed_number}. Bed marked for cleaning.`,
      data: bed
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBedStatus = (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const bed = bedsStore.find(b => b.id === id);
    if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' });

    bed.status = status;
    return res.json({ success: true, message: `Bed status updated to ${status}`, data: bed });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
