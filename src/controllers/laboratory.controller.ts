import { Request, Response } from 'express';
import { initialLabTests, initialLabOrders, LabTest, LabOrder } from '../data/mockStore.js';

let labTestsStore: LabTest[] = [...initialLabTests];
let labOrdersStore: LabOrder[] = [...initialLabOrders];

export const getLabTests = (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let list = [...labTestsStore];

    if (category) {
      list = list.filter(t => t.category.toLowerCase() === String(category).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(t => t.test_name.toLowerCase().includes(q) || t.test_code.toLowerCase().includes(q));
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLabOrders = (req: Request, res: Response) => {
  try {
    const { status, patient_id } = req.query;
    let list = [...labOrdersStore];

    if (status) {
      list = list.filter(o => o.sample_status.toLowerCase() === String(status).toLowerCase());
    }
    if (patient_id) {
      list = list.filter(o => o.patient_id === Number(patient_id));
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createLabOrder = (req: Request, res: Response) => {
  try {
    const body = req.body;
    const test = labTestsStore.find(t => t.id === Number(body.test_id)) || labTestsStore[0];
    const orderSeq = (labOrdersStore.length + 1).toString().padStart(3, '0');

    const newOrder: LabOrder = {
      id: Date.now(),
      order_code: `ORD-2026-${orderSeq}`,
      patient_id: Number(body.patient_id) || 1,
      patient_name: body.patient_name || 'Patient',
      patient_uhid: body.patient_uhid || 'UHID-2026-0001',
      doctor_name: body.doctor_name || 'Dr. Attending',
      test_name: test.test_name,
      category: test.category,
      sample_status: 'Ordered',
      normal_range: test.normal_range,
      order_date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    labOrdersStore.unshift(newOrder);

    return res.status(201).json({
      success: true,
      message: `Lab investigation test ordered: ${test.test_name}`,
      data: newOrder
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLabOrderStatus = (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status, result_value } = req.body;

    const order = labOrdersStore.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Lab order not found' });
    }

    if (status) order.sample_status = status;
    if (result_value) {
      order.result_value = result_value;
      if (!order.completed_at) {
        order.completed_at = new Date().toISOString().replace('T', ' ').substring(0, 16);
      }
    }

    return res.json({
      success: true,
      message: 'Lab order updated successfully',
      data: order
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
