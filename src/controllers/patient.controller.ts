import { Request, Response } from 'express';
import { initialPatients, Patient } from '../data/mockStore.js';
import { isDbConnected, query } from '../config/db.js';

let patientsStore: Patient[] = [...initialPatients];

export const getPatients = async (req: Request, res: Response) => {
  try {
    const { search, gender, blood_group } = req.query;

    if (isDbConnected()) {
      let sql = 'SELECT * FROM patients WHERE 1=1';
      const params: any[] = [];
      if (search) {
        sql += ' AND (first_name LIKE ? OR last_name LIKE ? OR uhid LIKE ? OR phone LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }
      const rows = await query(sql, params);
      return res.json({ success: true, count: rows.length, data: rows });
    }

    let filtered = [...patientsStore];
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(p =>
        p.first_name.toLowerCase().includes(q) ||
        p.last_name.toLowerCase().includes(q) ||
        p.uhid.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    }
    if (gender) {
      filtered = filtered.filter(p => p.gender === gender);
    }
    if (blood_group) {
      filtered = filtered.filter(p => p.blood_group === blood_group);
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const patient = patientsStore.find(p => p.id === id || p.uhid === req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    return res.json({ success: true, data: patient });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const uhidSequence = (patientsStore.length + 1).toString().padStart(4, '0');
    const newUhid = `UHID-2026-${uhidSequence}`;

    const newPatient: Patient = {
      id: Date.now(),
      uhid: newUhid,
      first_name: body.first_name,
      last_name: body.last_name,
      date_of_birth: body.date_of_birth || '1990-01-01',
      gender: body.gender || 'Male',
      blood_group: body.blood_group || 'O+',
      phone: body.phone,
      email: body.email || '',
      address: body.address || '',
      emergency_contact_name: body.emergency_contact_name || '',
      emergency_contact_phone: body.emergency_contact_phone || '',
      allergies: body.allergies || 'None',
      chronic_conditions: body.chronic_conditions || 'None',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    patientsStore.unshift(newPatient);

    return res.status(201).json({
      success: true,
      message: 'Patient registered successfully with UHID ' + newUhid,
      data: newPatient
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
