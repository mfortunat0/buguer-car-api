import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const recipeRoute = Router();
const prisma = new PrismaClient();

recipeRoute.get("/", async (req: Request, res: Response) => {
  try {
    const recipe = await prisma.recipe.findMany({
      include: {
        recipeItem: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json({
      recipe,
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

recipeRoute.get("/:data", async (req: Request, res: Response) => {
  const data = req.params.data;
  let recipes;

  if (!data) {
    res.status(400).send();
  }

  try {
    if (isNaN(Number(data))) {
      recipes = await prisma.recipe.findMany({
        where: {
          descricao: {
            contains: data,
            mode: "insensitive",
          },
        },
        include: {
          recipeItem: {
            include: {
              product: true,
            },
          },
        },
      });
    } else {
      recipes = await prisma.recipe.findUnique({
        where: {
          id: Number(data),
        },
        include: {
          recipeItem: {
            include: {
              product: true,
            },
          },
        },
      });
    }
    res.json({
      recipes,
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

recipeRoute.post(
  "/:id/product/:productId",
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const productId = Number(req.params.productId);
    const { quantidade } = req.body;

    if (!id || id < 1 || quantidade <= 0) {
      res.status(400).send();
      return;
    }

    try {
      const recipeExists = await prisma.recipe.findFirst({
        where: {
          id,
        },
      });

      if (!recipeExists) {
        res.status(400).send();
        return;
      }

      const productExists = await prisma.product.findFirst({
        where: {
          id: productId,
        },
      });

      if (!productExists) {
        res.status(400).send();
        return;
      }

      const recipeItem = await prisma.recipeItem.create({
        data: {
          quantidade,
          recipeId: id,
          productId,
        },
      });
      res.json({
        recipeItem,
      });
    } catch (error) {
      console.error(error);
      await prisma.$disconnect();
      res.status(500).json({ error });
    } finally {
      await prisma.$disconnect();
    }
  }
);

recipeRoute.post("/", async (req: Request, res: Response) => {
  const { descricao } = req.body;

  if (!descricao) {
    res.status(400).send();
    return;
  }

  try {
    const recipe = await prisma.recipe.create({
      data: {
        descricao,
      },
    });
    res.json({
      recipe,
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

recipeRoute.put("/:id", async (req: Request, res: Response) => {
  const { descricao } = req.body;
  const id = Number(req.params.id);

  if (!id || id < 1 || !descricao) {
    res.status(400).send();
    return;
  }

  try {
    const recipeExists = await prisma.recipe.findFirst({
      where: {
        id,
      },
    });

    if (!recipeExists) {
      res.status(400).send();
      return;
    }

    await prisma.recipe.update({
      where: {
        id,
      },
      data: {
        descricao,
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

recipeRoute.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || id < 1) {
    res.status(400).send();
  }

  try {
    const recipeExists = await prisma.recipe.findFirst({
      where: {
        id,
      },
    });

    if (!recipeExists) {
      res.status(400).send();
      return;
    }

    await prisma.recipe.delete({
      where: {
        id,
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

recipeRoute.delete("/recipeItem/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || id < 1) {
    res.status(400).send();
  }

  try {
    const recipeExists = await prisma.recipeItem.findFirst({
      where: {
        id,
      },
    });

    if (!recipeExists) {
      res.status(400).send();
      return;
    }

    await prisma.recipeItem.delete({
      where: {
        id,
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
});

export { recipeRoute };
