import './form_reserva.css';

function FormularioReserva() {
    return (
        <>
            <div className="pm-form-card">

                <div className="pm-card-title">
                    <div className="pm-number">1</div>

                    <div>
                        <h2>Tus datos</h2>
                        <p>Completá la información para tu reserva</p>
                    </div>
                </div>

                <div className="pm-form-grid">

                    <div className="pm-input">
                        <label>Nombre y apellido</label>
                        <input type="text" placeholder="Miguel" />
                    </div>

                    <div className="pm-input">
                        <label>Número de celular</label>
                        <input type="text" placeholder="+54 9 2966 76 4900" />
                    </div>

                    <div className="pm-input">
                        <label>Email</label>
                        <input type="text" placeholder="example@example.com" />
                    </div>

                    <div className="pm-input">
                        <label>Fecha</label>
                        <input type="date" />
                    </div>

                    <div className="pm-input">
                        <label>Cantidad de pasajeros</label>
                        <select>
                            <option>1 pasajero</option>
                            <option>2 pasajeros</option>
                            <option>3 pasajeros</option>
                            <option>4 pasajeros</option>
                        </select>
                    </div>

                    <div className="pm-input">
                        <label>Punto de encuentro / Hotel / Alojamiento</label>
                        <input type="text" name="" id="" />
                    </div>

                    <div className="pm-input">
                        <label>Opcion de pago</label>
                        <select>
                            <option>Efectivo / Cash</option>
                            <option>Transferencia / virtual</option>
                            <option>Tarjeta</option>
                        </select>
                    </div>

                </div>

                <div className="pm-alert">
                    Importante: El horario de salida y regreso es fijo para todas las excursiones compartidas.
                </div>


                <div className="pm-confirmation">

                    <div className="pm-card-title">
                        <div className="pm-number">2</div>

                        <div>
                            <h2>Confirmación de tu reserva</h2>
                            <p>Revisá los detalles y confirmá por WhatsApp</p>
                        </div>
                    </div>

                    <div className="pm-confirm-box">

                        <div className="pm-confirm-row">
                            <span>Servicio</span>
                            <strong>Perito Moreno Compartido</strong>
                        </div>

                        <div className="pm-confirm-row">
                            <span>Salida</span>
                            <strong>08:00 hs</strong>
                        </div>

                        <div className="pm-confirm-row">
                            <span>Regreso</span>
                            <strong>14:00 hs</strong>
                        </div>

                        <div className="pm-confirm-row">
                            <span>Pasajeros</span>
                            <strong id="pmPassengers">2 pasajeros</strong>
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}

export default FormularioReserva;