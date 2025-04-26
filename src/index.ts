import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {PrismaClient, Stage} from "@prisma/client";

const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(express.json());
const prisma = new PrismaClient()

app.get('/contact', async (req: Request, res: Response) => {
    //const stage = req.query.stage;
    const a = res.header("api_key", "hola")
    console.log(a);
    const contact = await prisma.contact.findMany();
    res.status(200).json({"ms": contact});
  });


// Ruta para buscar un contacto por ID
app.get('/contact/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const contact = await prisma.contact.findUnique({ where: { id } });
      if (contact) res.json(contact);
      else res.status(404).json({ error: 'Contacto no encontrado.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar el contacto.' });
    }
  });
  

// Crear una nueva oportunidad
app.post('/Opportunity', async (req: Request, res: Response) => {
  const { name, description, estimatedValue, currency, stage, expectedCloseDate, companyId } = req.body;
  try {
      const nuevaOportunidad = await prisma.opportunity.create({
          data: {
              name,
              description,
              estimatedValue,
              currency,
              stage,
              expectedCloseDate: new Date(expectedCloseDate),
              companyId,
          },
      });
      res.status(201).json(nuevaOportunidad);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la oportunidad.' });
  }
});


// Listar oportunidades por etapa (stage)
app.get('/listarpor', async (req: Request, res: Response) => {
  const { stage } = req.query;
  try {
      const oportunidades = await prisma.opportunity.findMany({
          where: { stage: stage as Stage },
      });
      res.json(oportunidades);
  } catch (error) {
      res.status(500).json({ error: 'No se pudieron obtener las oportunidades.' });
  }
});

app.listen(PORT, () => {
    console.log(`Bienvenido al servidor en http://localhost:${PORT}`);
  });