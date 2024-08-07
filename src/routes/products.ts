import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const productsRoute = Router();
const prisma = new PrismaClient();

productsRoute.get("/", async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json({
      products,
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

productsRoute.get("/:data", async (req: Request, res: Response) => {
  const data = req.params.data;
  let products;

  if (!data) {
    res.status(400).send();
  }

  try {
    if (isNaN(Number(data))) {
      products = await prisma.product.findMany({
        where: {
          descricao: {
            contains: data,
            mode: "insensitive",
          },
        },
      });
    } else {
      products = await prisma.product.findUnique({
        where: {
          id: Number(data),
        },
      });
    }
    res.json({
      products,
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

productsRoute.post("/", async (req: Request, res: Response) => {
  const { descricao, estoqueInicial, custo, preco, ean, oferta } = req.body;

  if (!descricao || !estoqueInicial || !custo || !preco) {
    res.status(400).send();
    return;
  }

  try {
    const products = await prisma.product.create({
      data: {
        descricao,
        estoque: estoqueInicial,
        custo,
        preco,
        ean,
        oferta,
      },
    });
    res.json({
      products,
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

productsRoute.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || id < 1) {
    res.status(400).send();
    return;
  }

  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!productExists) {
      res.status(400).send();
      return;
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
  } finally {
    await prisma.$disconnect();
  }
});

productsRoute.put("/price/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { price } = req.body;

  if (!id || id < 1 || !price || price < 0) {
    res.status(400).send();
    return;
  }

  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!productExists) {
      res.status(400).send();
      return;
    }

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        preco: price,
      },
    });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

productsRoute.put("/ean/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { ean } = req.body;

  if (!id || id < 1 || !ean || ean.length < 8 || ean.length > 14) {
    res.status(400).send();
    return;
  }

  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!productExists) {
      res.status(400).send();
      return;
    }

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        ean: String(ean),
      },
    });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

productsRoute.put("/balance/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { balance } = req.body;

  if (!id || id < 1 || !balance || balance < 0) {
    res.status(400).send();
    return;
  }

  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!productExists) {
      res.status(400).send();
      return;
    }

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        estoque: balance,
      },
    });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

productsRoute.put("/description/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { description } = req.body;

  if (!id || id < 1 || !description) {
    res.status(400).send();
    return;
  }

  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!productExists) {
      res.status(400).send();
      return;
    }

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        descricao: description,
      },
    });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

productsRoute.put("/offer/:id", async (req: Request, res: Response) => {
  const { oferta } = req.body;
  const id = Number(req.params.id);

  if (!id || id < 1 || !oferta || oferta < 0) {
    res.status(400).send();
    return;
  }

  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!productExists) {
      res.status(400).send();
      return;
    }

    if (!productExists.preco || productExists.preco <= oferta) {
      res.status(400).send();
      return;
    }

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        oferta,
      },
    });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

export { productsRoute };
