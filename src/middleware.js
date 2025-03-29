import { defineMiddleware } from "astro:middleware";
import { createSessionClient } from "@/src/lib/appwrite";
import { databases } from "@/src/lib/appwrite";
import { ID } from "node-appwrite";

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  try {
    const { account } = createSessionClient(request);
    locals.user = await account.get();
  } catch {
    locals.user = null;
  }

  // Get the last execution date from the document.
  const { lastExecute } = await databases.getDocument(
    import.meta.env.PUBLIC_APPWRITE_DB,
    import.meta.env.PUBLIC_APPWRITE_EXECUTION,
    "67e805820025043db8e1"
  );

  // Compare only the day part. This ensures the code runs only once per day.
  const lastExecutionDate = new Date(lastExecute);
  const now = new Date();

  if (lastExecutionDate.toDateString() === now.toDateString()) {
    return next();
  }

  console.log(lastExecutionDate.toISOString());

  try {
    // Obtener lista de clientes
    const { documents: clients } = await databases.listDocuments(
      import.meta.env.PUBLIC_APPWRITE_DB,
      import.meta.env.PUBLIC_APPWRITE_CLIENTS
    );

    console.log(clients);

    const overdueClients = clients.filter(client => {
      const lastPayment = new Date(client.lastPayment);
      const differenceInMonths =
        (now.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return differenceInMonths > 1;
    });
    console.log(overdueClients);

    let res;
    if (overdueClients.length === 1) {
      // Si hay un solo cliente con pagos atrasados, enviar una notificación individual
      const client = overdueClients[0];
      const notification = {
        message: `El cliente <a href="/admin/clients/${client.$id}">${client.name} ${client.lastname}</a> tiene más de un mes sin pagar.`,
      };

      res = await databases.createDocument(
        import.meta.env.PUBLIC_APPWRITE_DB,
        import.meta.env.PUBLIC_APPWRITE_NOTIFICATIONS,
        ID.unique(),
        notification
      );
      console.log(res);

    } else if (overdueClients.length > 1) {
      // Si hay varios clientes con pagos atrasados, enviar una notificación grupal
      const clientNames = overdueClients
        .map(client => `<a href="/admin/clients/${client.$id}">${client.name} ${client.lastname}</a>`)
        .join(", ");
      const notification = {
        message: `Los clientes ${clientNames} tienen más de un mes sin pagar.`,
      };

      res = await databases.createDocument(
        import.meta.env.PUBLIC_APPWRITE_DB,
        import.meta.env.PUBLIC_APPWRITE_NOTIFICATIONS,
        ID.unique(),
        notification
      );
      console.log(res);
    }

    // Actualizar el campo lastExecute a la fecha actual
    await databases.updateDocument(
      import.meta.env.PUBLIC_APPWRITE_DB,
      import.meta.env.PUBLIC_APPWRITE_EXECUTION,
      "67e805820025043db8e1",
      { lastExecute: now }
    );
  } catch (error) {
    console.error("Error al verificar:", error);
  }

  return next();
});
