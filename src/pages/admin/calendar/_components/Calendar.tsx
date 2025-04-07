import { ID } from "appwrite";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { useEffect, useState, useRef } from "react";
import { databases } from "@/src/lib/appwrite";
import { Query } from "node-appwrite";

export default function Calendar() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [eventType, setEventType] = useState("");
  const [color, setColor] = useState("#cccccc");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const eventDialogRef = useRef<HTMLDialogElement>(null);
  const detailsDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const documents = await databases
          .listDocuments(
            import.meta.env.PUBLIC_APPWRITE_DB,
            import.meta.env.PUBLIC_APPWRITE_EVENTS
          )
          .then(response => {
            const docs = response.documents;
            docs.forEach(doc => {
              doc.start = new Date(doc.start);
              doc.end = new Date(doc.end);
            });
            return docs;
          });
        setEvents(documents);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, [events]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        await databases
          .listDocuments(
            import.meta.env.PUBLIC_APPWRITE_DB,
            import.meta.env.PUBLIC_APPWRITE_CLIENTS,
            [Query.equal("isClient", true)]
          )
          .then(response => {
            const docs = response.documents;
            setClients(docs);
          });
      } catch (error) {
        console.error(error);
      }
    };
    fetchClients();
  }, []);

  const createEvent = async (eventInfo: any) => {
    if (selectedEvent) {
      const start = new Date(selectedEvent.start);
      const [hours, minutes] = time.split(":").map(Number);
      start.setHours(hours, minutes, 0, 0);
      const end = new Date(start);
      end.setHours(start.getHours() + duration);

      const newEvent = {
        title: `${eventInfo.title} (${eventInfo.eventType})`,
        start,
        end,
        backgroundColor: eventInfo.color,
        borderColor: eventInfo.color,
        allDay: false,
      };
      try {
        await databases.createDocument(
          import.meta.env.PUBLIC_APPWRITE_DB,
          import.meta.env.PUBLIC_APPWRITE_EVENTS,
          ID.unique(),
          newEvent
        );
        setEvents((prevEvents: any) => [...prevEvents, newEvent]);
      } catch (error) {
        console.error(error);
      } finally {
        setSelectedEvent(null);
        setTitle("");
        setTime("");
        setDuration(1);
        setEventType("");
        setColor("#cccccc");
      }
    }
    eventDialogRef.current?.close();
  };

  const handleSelect = (selectInfo: any) => {
    eventDialogRef.current?.showModal();
    setSelectedEvent(selectInfo);
  };

  const handleEventClick = (clickInfo: any) => {
    setEventDetails(clickInfo.event);
    detailsDialogRef.current?.showModal();
  };

  const deleteEvent = (eventId: string) => {
    setEventToDelete(eventId);
    dialogRef.current?.showModal();
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        await databases.deleteDocument(
          import.meta.env.PUBLIC_APPWRITE_DB,
          import.meta.env.PUBLIC_APPWRITE_EVENTS,
          eventToDelete
        );
        setEvents(prevEvents =>
          prevEvents.filter(event => event.$id !== eventToDelete)
        );
        setEventToDelete(null);
      } catch (error) {
        console.error(error);
      }
    }
    dialogRef.current?.close();
  };

  const cancelDelete = () => {
    setEventToDelete(null);
    dialogRef.current?.close();
    eventDialogRef.current?.close();
    detailsDialogRef.current?.close();
  };

  return (
    <div>
      <div className="my-2 flex gap-4  justify-start">
        <a
          href="/admin"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Volver a Panel de Control
        </a>
      </div>
      <div className="flex gap-8">
        <aside className="w-1/3">
          <div className="border border-gray-300 rounded-md p-4 mt-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Eventos del Mes
            </h3>
            <div className="space-y-2">
              {events
                .filter(
                  event => event.start.getMonth() === new Date().getMonth()
                )
                .map(event => (
                  <div
                    key={event.$id}
                    className="flex items-center justify-between p-2 border-b border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: event.backgroundColor }}
                      />
                      <span className="text-sm text-gray-800">
                        {event.title}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEventDetails(event);
                          detailsDialogRef.current?.showModal();
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => deleteEvent(event.$id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              {events.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No hay eventos programados
                </p>
              )}
            </div>
          </div>
        </aside>
        <div className="flex-1">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            events={events}
            locale={esLocale}
            titleFormat={{
              year: "numeric",
              month: "short",
            }}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
            initialView="dayGridMonth"
            selectable
            select={handleSelect}
            eventClick={handleEventClick}
            editable={true}
            height="auto"
            dayMaxEvents={true}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
              hour12: false,
            }}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
            }}
            eventDisplay="block"
            contentHeight={600}
            aspectRatio={1.8}
          />
        </div>

        <dialog ref={dialogRef} className="p-6 rounded-md shadow-lg bg-white">
          <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
          <p className="mb-6 text-gray-700">
            ¿Estás seguro de que deseas eliminar este evento?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md"
            >
              Eliminar
            </button>
          </div>
        </dialog>
        <dialog
          ref={eventDialogRef}
          className="p-6 lg:min-w-[600px] rounded-md shadow-lg bg-white"
        >
          <div className="flex flex-col">
            <main>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Agregar Evento
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700">Cliente</label>
                  <select
                    value={title}
                    onChange={e => {
                      const selectedClient = clients.find(
                        client =>
                          `${client.name} ${client.lastname}` === e.target.value
                      );
                      if (selectedClient) {
                        setTitle(
                          `${selectedClient.name} ${selectedClient.lastname}`
                        );
                      }
                    }}
                    className="mt-1 outline-none border p-2 block w-full border-gray-300 focus:border-blue-500 focus:ring-0 rounded-md"
                  >
                    <option disabled value="">
                      Seleccione un cliente
                    </option>
                    {clients.map(client => (
                      <option
                        key={client.$id}
                        value={`${client.name} ${client.lastname}`}
                      >
                        {`${client.name} ${client.lastname}`}
                      </option>
                    ))}
                  </select>
                  <datalist id="">
                    {clients.map(client => (
                      <option
                        key={client.$id}
                        value={`${client.name} ${client.lastname}`}
                      >
                        {`${client.name} ${client.lastname}`}
                      </option>
                    ))}
                  </datalist>
                  <label className="block text-sm text-gray-700 mt-3">
                    Hora de la cita
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="mt-1 outline-none border p-2 block w-full border-gray-300 focus:border-blue-500 focus:ring-0 rounded-md"
                  />
                  <label className="block text-sm text-gray-700 mt-3">
                    Duración (horas)
                  </label>
                  <select
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="mt-1 outline-none border p-2 block w-full border-gray-300 focus:border-blue-500 focus:ring-0 rounded-md"
                  >
                    {[1, 2, 3, 4, 5].map(hour => (
                      <option key={hour} value={hour}>
                        {hour} hora{hour > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                  <label className="block text-sm text-gray-700 mt-3">
                    Tipo de Evento
                  </label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value)}
                    className="mt-1 outline-none border p-2 block w-full border-gray-300 focus:border-blue-500 focus:ring-0 rounded-md"
                  >
                    <option disabled value="">
                      Seleccione un tipo
                    </option>
                    <option value="Junta">Junta</option>
                    <option value="Reunión">Reunión</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <label className="block text-sm text-gray-700 mt-4">
                    Color
                  </label>
                  <input
                    type="color"
                    name="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="mt-1 outline-none border-none block w-full h-10 border-gray-300 focus:border-blue-500 focus:ring-0 rounded-md"
                  />
                </div>
              </div>
            </main>
            <div className="flex justify-end gap-4 mt-auto pt-6">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 w-full border text-gray-600 hover:text-gray-800 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="w-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition-colors disabled:opacity-50 rounded-md"
                onClick={() => createEvent({ title, time, color, eventType })}
                disabled={!selectedEvent || !title || !time || !eventType}
              >
                Agregar Evento
              </button>
            </div>
          </div>
        </dialog>
        <dialog
          ref={detailsDialogRef}
          className="p-6 lg:min-w-[400px] rounded-md shadow-lg bg-white"
        >
          {eventDetails && (
            <div className="space-y-4 outline-none">
              <h3 className="text-xl font-bold text-gray-800">
                Detalles del Evento
              </h3>
              <div className="text-sm text-gray-700">
                <p>
                  <strong className="font-medium">Título:</strong>{" "}
                  {eventDetails.title}
                </p>
                <p>
                  <strong className="font-medium">Inicio:</strong>{" "}
                  {new Date(eventDetails.start).toLocaleString("es-ES", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
                <p>
                  <strong className="font-medium">Fin:</strong>{" "}
                  {new Date(eventDetails.end).toLocaleString("es-ES", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </dialog>
      </div>
    </div>
  );
}
