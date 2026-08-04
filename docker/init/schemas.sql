--
-- PostgreSQL database dump
--

\restrict DwajTBzhH6qzLae5KxJaFJfpZMSaaqv53pNFP0cl8F2xWWka1lkhIqj7Er8Q7kW

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

-- Started on 2026-08-04 11:38:37

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: alert_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alert_rules (
    id uuid NOT NULL,
    organization_id character varying(100),
    account_id character varying(100),
    region character varying(50),
    service character varying(50) NOT NULL,
    resource_type character varying(50) NOT NULL,
    metric character varying(100) NOT NULL,
    operator character varying(5) NOT NULL,
    threshold double precision NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.alert_rules OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16398)
-- Name: alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerts (
    id uuid NOT NULL,
    rule_id uuid NOT NULL,
    organization_id character varying(100) NOT NULL,
    account_id character varying(100) NOT NULL,
    region character varying(50) NOT NULL,
    service character varying(50) NOT NULL,
    resource_type character varying(50) NOT NULL,
    resource_id character varying(200) NOT NULL,
    resource_name character varying(200) NOT NULL,
    metric character varying(100) NOT NULL,
    operator character varying(5) NOT NULL,
    current_value double precision NOT NULL,
    threshold double precision NOT NULL,
    state character varying(20) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    resolved_at timestamp without time zone
);


ALTER TABLE public.alerts OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16415)
-- Name: rule_resources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rule_resources (
    rule_id uuid NOT NULL,
    resource_id character varying(200) NOT NULL
);


ALTER TABLE public.rule_resources OWNER TO postgres;

--
-- TOC entry 4752 (class 2606 OID 16397)
-- Name: alert_rules alert_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alert_rules
    ADD CONSTRAINT alert_rules_pkey PRIMARY KEY (id);


--
-- TOC entry 4754 (class 2606 OID 16404)
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- TOC entry 4763 (class 2606 OID 16419)
-- Name: rule_resources rule_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_resources
    ADD CONSTRAINT rule_resources_pkey PRIMARY KEY (rule_id, resource_id);


--
-- TOC entry 4755 (class 1259 OID 16414)
-- Name: idx_alerts_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerts_active ON public.alerts USING btree (rule_id, resource_id, state);


--
-- TOC entry 4756 (class 1259 OID 16413)
-- Name: idx_alerts_resource; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerts_resource ON public.alerts USING btree (resource_id);


--
-- TOC entry 4757 (class 1259 OID 16412)
-- Name: idx_alerts_rule; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerts_rule ON public.alerts USING btree (rule_id);


--
-- TOC entry 4758 (class 1259 OID 16411)
-- Name: idx_alerts_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerts_state ON public.alerts USING btree (state);


--
-- TOC entry 4759 (class 1259 OID 16427)
-- Name: idx_rule_resources_lookup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rule_resources_lookup ON public.rule_resources USING btree (resource_id, rule_id);


--
-- TOC entry 4760 (class 1259 OID 16426)
-- Name: idx_rule_resources_resource; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rule_resources_resource ON public.rule_resources USING btree (resource_id);


--
-- TOC entry 4761 (class 1259 OID 16425)
-- Name: idx_rule_resources_rule; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rule_resources_rule ON public.rule_resources USING btree (rule_id);


--
-- TOC entry 4764 (class 2606 OID 16405)
-- Name: alerts fk_alert_rule; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT fk_alert_rule FOREIGN KEY (rule_id) REFERENCES public.alert_rules(id);


--
-- TOC entry 4765 (class 2606 OID 16420)
-- Name: rule_resources fk_rule_resources_rule; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_resources
    ADD CONSTRAINT fk_rule_resources_rule FOREIGN KEY (rule_id) REFERENCES public.alert_rules(id) ON DELETE CASCADE;


-- Completed on 2026-08-04 11:38:37

--
-- PostgreSQL database dump complete
--

\unrestrict DwajTBzhH6qzLae5KxJaFJfpZMSaaqv53pNFP0cl8F2xWWka1lkhIqj7Er8Q7kW

