import { Request, Response } from 'express';
import { initialDoctors, Doctor } from '../data/mockStore.js';

let doctorsStore: Doctor[] = [...initialDoctors];

export const getDoctors = (req: Request, res: Response) => {
  try {
    const { department } = req.query;
    let list = [...doctorsStore];

    if (department) {
      list = list.filter(d => d.department.toLowerCase() === String(department).toLowerCase());
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const doctor = doctorsStore.find(d => d.id === id);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  return res.json({ success: true, data: doctor });
};
