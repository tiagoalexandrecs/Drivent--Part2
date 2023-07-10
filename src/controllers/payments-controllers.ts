import paymentServices from '@/services/payment-services.ts';
import ticketServices from '@/services/tickets-services.ts';
import { Response, Request } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { CreatePayment } from '@/protocols';

export async function payment(req: AuthenticatedRequest, res: Response) {
  const payInfo = req.body as CreatePayment;

  try {
    const ticket = await ticketServices.getTicketById(payInfo.ticketId);
    const type = await ticketServices.getTypeById(ticket.ticketTypeId);
    const action = await paymentServices.payment(payInfo, type.price);

    if (action === 400) {
      return res.sendStatus(400);
    } else {
      return res.status(200).send(action);
    }
  } catch (err) {
    console.log(err.message);
  }
}

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const ticket = Number(req.query.ticketId);
  const userId = Number(req.userId);

  try {
    const action = await paymentServices.getPayment(ticket);
    return res.status(200).send(action);
  } catch (err) {
    console.log(err.message);
  }
}